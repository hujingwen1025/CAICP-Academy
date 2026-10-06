# Third-party notices

- **Nginx**, BSD-2-Clause, used only by the optional Docker server. The Dockerfile uses the [official Nginx image](https://hub.docker.com/_/nginx); Nginx and the bundled Alpine Linux packages retain their upstream licenses and notices. See https://nginx.org/LICENSE. They do not change the Academy's code or educational-content licenses.
- **CAICP Book v0.9**, 陈峥. Text, illustrations and practice questions: CC BY-NC-SA 4.0; independent example code: MIT. See CONTENT-LICENSE.md and https://github.com/UESTC1010/CAICP_Book.
- **Pyodide v314.0.7**, Pyodide contributors and Mozilla, Mozilla Public License 2.0. Optional runtime loaded from https://cdn.jsdelivr.net/pyodide/v314.0.7/full/. Source: https://github.com/pyodide/pyodide. Runtime distribution includes CPython and other components under their respective licenses. License: https://github.com/pyodide/pyodide/blob/main/LICENSE.
- **CPython**, Python Software Foundation License. https://docs.python.org/3/license.html.
- **NumPy**, BSD-3-Clause. https://github.com/numpy/numpy/blob/main/LICENSE.txt.
- **Pandas**, BSD-3-Clause. https://github.com/pandas-dev/pandas/blob/main/LICENSE.
- **Matplotlib**, Matplotlib license based on the PSF license. https://matplotlib.org/stable/project/license.html.
- **scikit-learn**, BSD-3-Clause. https://github.com/scikit-learn/scikit-learn/blob/main/COPYING.
- Python packages and their dependencies are downloaded on demand by Pyodide, not copied into the repository. Their distributions and upstream notices remain applicable. Review upstream bundled notices when redistributing runtime packages.
- System fonts are used; no font files or icon packages are distributed. The Academy favicon and dashboard illustration were created for this project.

- **External educational videos**: original works by the creators cited immediately beneath each player and listed in `data/videos.json` and [VIDEO-RESEARCH.md](VIDEO-RESEARCH.md). Audiovisual works remain subject to their creators' and providers' terms. They are linked/embedded, never downloaded or rehosted. The Academy's CC BY-NC-SA4.0 license covers its own viewing guidance and educational adaptations, not external audiovisual works. UI translation does not change or imply translation rights in the videos.
- **YouTube**: click-to-load players are served by YouTube using its privacy-enhanced embed domain. Loading a player contacts the provider and its terms/privacy practices apply. Normal player controls, attribution and branding are retained. See https://developers.google.com/youtube/player_parameters and https://developers.google.com/youtube/terms/required-minimum-functionality#embedded-player-api-client-identity.
