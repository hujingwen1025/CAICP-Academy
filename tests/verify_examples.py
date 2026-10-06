"""Independently execute safe, identified book snippets and numerical examples."""
import json, io, contextlib, math, pathlib, unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]
DATA=json.loads((ROOT/'data/exams.json').read_text())
Q={q['id']:q for q in DATA['questions']}
class Examples(unittest.TestCase):
    def test_book_python_outputs(self):
        snippets={'book-E-02':'count =','book-E-03':'a =','book-E-05':'s =','book-E-06':'values =','book-E-07':'x =','book-E-08':'total =','book-J-06':'print(','book-J-07':'def f','book-J-08':'grid =','book-S-07':'from functools','book-S-08':'class Meter'}
        for id,marker in snippets.items():
            with self.subTest(id=id):
                q=Q[id];prompt=q['prompt']['en'];code=prompt[prompt.index('\n'+marker)+1:];values=iter(['8','3']);ns={'input':lambda:next(values)};out=io.StringIO()
                with contextlib.redirect_stdout(out):exec(compile(code,id,'exec'),ns)
                expected=q['options'][q['answer'][0]]['en']
                self.assertEqual(out.getvalue().strip(),expected)
    def test_arithmetic(self):
        self.assertEqual(18-8/2+3*2,20.0)
        self.assertEqual([t*t-4*t+7 for t in [1,2,3]],[4,3,4])
    def test_knn(self):
        pts=[(2,1,'R'),(0,2,'B'),(3,4,'B'),(5,2,'R'),(2,6,'R')]
        near=sorted(enumerate(pts),key=lambda p:(p[1][0]-2)**2+(p[1][1]-2)**2)[:3]
        self.assertEqual([n for n,p in near],[0,1,2]);self.assertEqual(sum(p[2]=='B' for n,p in near),2)
    def test_mlp(self):
        x1,x2=-1,2;h1=max(0,2*x1+x2-1);h2=max(0,-x1+x2)
        self.assertEqual(h1-2*h2+4,-2)
    def test_threshold_constraints(self):
        feasible=[(5*(20-tp)+fp,name) for name,tp,fp in [('L',19,17),('M',16,8),('H',12,3)] if tp+fp<=25]
        self.assertEqual(min(feasible),(28,'M'))
    def test_errors_units_and_probability(self):
        err=[-3,-1,1,3];self.assertEqual(sum(abs(e) for e in err)/4,2);self.assertEqual(sum(e*e for e in err)/4,5)
        self.assertEqual(sum((10*e)**2 for e in err)/4,500);self.assertAlmostEqual(2/4*1/3,1/6)
        self.assertAlmostEqual(.01*.9/(.01*.9+.99*.1),1/12)
    def test_grid_shortest_path(self):
        from collections import deque
        blocked={(2,y) for y in range(4)};todo=deque([((0,0),0)]);seen={(0,0)};distance=None
        while todo:
            (x,y),n=todo.popleft()
            if (x,y)==(4,3):distance=n;break
            for a,b in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
                if 0<=a<=4 and 0<=b<=4 and (a,b) not in blocked|seen:seen.add((a,b));todo.append(((a,b),n+1))
        self.assertEqual(distance,9);self.assertEqual(math.hypot(4,3),5)
    def test_binary_image(self):
        rows=['1010','0111','1001'];self.assertEqual([int(row[::-1] if i==1 else row,2) for i,row in enumerate(rows)],[10,14,9])
    def test_gradient_and_convolution_parameters(self):
        w=0-.1*2*(0-3);self.assertAlmostEqual(w,.6);self.assertAlmostEqual((w-3)**2,5.76)
        self.assertEqual(4*(3*3*3+1),112)
if __name__=='__main__':unittest.main()
