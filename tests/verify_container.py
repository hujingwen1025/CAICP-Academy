"""Check a locally built Docker server without contacting video/CDN providers."""
import argparse
import ast
from pathlib import Path
import re
import unittest
from urllib.error import HTTPError
from urllib.parse import urljoin
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("url", nargs="?", default="http://localhost:8080")
args = parser.parse_args()
BASE = args.url.rstrip("/") + "/"


def get(path):
    try:
        with urlopen(urljoin(BASE, path), timeout=10) as response:
            return response.status, response.headers, response.read()
    except HTTPError as error:
        return error.code, error.headers, error.read()


class ContainerChecks(unittest.TestCase):
    def test_every_offline_asset_matches_the_checkout(self):
        core = ast.literal_eval(re.search(r"const CORE=(\[.*?\]);", (ROOT / "sw.js").read_text()).group(1))
        for path in core + ["./sw.js"]:
            with self.subTest(asset=path):
                status, headers, body = get(path)
                self.assertEqual(status, 200)
                local = ROOT / ("index.html" if path == "./" else path.removeprefix("./"))
                self.assertEqual(body, local.read_bytes(), "Rebuild the image after editing assets")
                self.assertIn("no-cache", headers.get("Cache-Control", ""))

    def test_module_and_data_mime_types(self):
        expected = {
            "js/app.js": {"application/javascript", "text/javascript"},
            "js/python-worker.js": {"application/javascript", "text/javascript"},
            "sw.js": {"application/javascript", "text/javascript"},
            "data/curriculum.json": {"application/json"},
            "styles.css": {"text/css"},
            "assets/favicon.svg": {"image/svg+xml"},
        }
        for path, types in expected.items():
            with self.subTest(asset=path):
                status, headers, _ = get(path)
                self.assertEqual(status, 200)
                self.assertIn(headers.get_content_type(), types)

    def test_private_and_missing_files_are_not_served(self):
        for path in [".git/config", "Dockerfile", "compose.yaml", "docker/nginx.conf", "tests/core.test.js", "missing.js"]:
            with self.subTest(path=path):
                self.assertEqual(get(path)[0], 404)

    def test_embed_referrer_policy(self):
        status, headers, _ = get("index.html")
        self.assertEqual(status, 200)
        self.assertEqual(headers.get("Referrer-Policy"), "strict-origin-when-cross-origin")


if __name__ == "__main__":
    unittest.main(argv=[__file__], verbosity=2)
