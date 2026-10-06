"""Execute authored lesson starters and independently verify worked numbers.
Standard-library checks run everywhere. Optional numerical/plotting fixtures
run when NumPy, Pandas, Matplotlib and scikit-learn are installed.
"""
import contextlib,importlib.util,io,json,math,os,pathlib,subprocess,sys,unittest
ROOT=pathlib.Path(__file__).resolve().parents[1]
CONTENT=json.loads((ROOT/'data/lesson-content.json').read_text())
BLOCKS=[b for s in CONTENT['sections'] for b in s['blocks']]
PACKAGES=all(importlib.util.find_spec(n) for n in ['numpy','pandas','matplotlib','sklearn'])
class LearningExamples(unittest.TestCase):
    def execute_starters(self,optional):
        for b in BLOCKS:
            if not b.get('code'):continue
            needs=any(n in b['code'] for n in ['import numpy','import pandas','import matplotlib','from sklearn'])
            if needs!=optional:continue
            with self.subTest(concept=b['id']):
                env={**os.environ,'OPENBLAS_NUM_THREADS':'1','OMP_NUM_THREADS':'1','MPLBACKEND':'Agg'}
                code=b['code']
                if b.get('exercise')=='plot':code+='\nassert plt.get_fignums(), "Example must produce a figure"'
                result=subprocess.run([sys.executable,'-c',code],input=b.get('input',''),capture_output=True,text=True,timeout=30,env=env)
                self.assertEqual(result.returncode,0,result.stderr)
                if b.get('expected'):self.assertEqual(result.stdout.strip(),b['expected'].strip())
    def test_standard_library_starters(self):self.execute_starters(False)
    @unittest.skipUnless(PACKAGES,'Optional packages unavailable; install requirements-validation.txt for full check')
    def test_numerical_library_and_plot_starters(self):self.execute_starters(True)
    def test_statistics_probabilities_and_bayes(self):
        values=[2,3,3,4,8];self.assertEqual(sum(values)/5,4);self.assertEqual((3*4+7*8)/10,6.8)
        self.assertAlmostEqual(1-.8**3,.488);self.assertAlmostEqual(3*.2*.8**2,.384)
        p=.6;self.assertAlmostEqual(p*.75/(p*.75+(1-p)*.5),9/13)
        p=9/13;self.assertAlmostEqual(p*.25/(p*.25+(1-p)*.5),9/17)
        self.assertAlmostEqual(sum((t-2)**2 for t in [0,2,4])/3,8/3)
    def test_errors_thresholds_and_groups(self):
        self.assertEqual(sum((y-10)**2 for y in [8,8,12,12])/4,4)
        self.assertEqual(sum((y-10)**2 for y in [10,10,10,18])/4,16)
        self.assertAlmostEqual((76+14)/(80+20),.9)
        matrix=[[8,2,0],[1,7,2],[0,3,7]];tp=matrix[1][1];fn=sum(matrix[1])-tp;fp=sum(r[1] for r in matrix)-tp;tn=sum(map(sum,matrix))-tp-fn-fp
        self.assertEqual((tp,fn,fp,tn),(7,3,5,15))
    def test_regression_gradient_backprop_and_regularization(self):
        xs,ys=[1,2,3],[2,3,7];mx,my=sum(xs)/3,sum(ys)/3
        w=sum((a-mx)*(b-my) for a,b in zip(xs,ys))/sum((a-mx)**2 for a in xs);bias=my-w*mx
        self.assertEqual(w,2.5);self.assertEqual(bias,-1);self.assertEqual(sum((w*a+bias-b)**2 for a,b in zip(xs,ys))/3,.5)
        w=0
        for expected in [.4,.72,.976]:w-=.1*2*(w-2);self.assertAlmostEqual(w,expected)
        w,v=1-.01*24,3-.01*8;prediction=v*max(0,w*2);self.assertAlmostEqual(prediction,4.4384);self.assertAlmostEqual((prediction-4)**2,.19219456)
        self.assertEqual(10/(5+2*2.5),1)
    def test_kmeans_convolution_and_attention(self):
        vals=[1,2,3,8,9];centers=[1.,4.]
        for _ in range(2):
            groups=[[v for v in vals if min(range(2),key=lambda i:abs(v-centers[i]))==j] for j in range(2)]
            centers=[sum(g)/len(g) for g in groups]
        self.assertEqual(centers,[2.,8.5]);self.assertEqual(sum(min((v-c)**2 for c in centers) for v in vals),2.5)
        im=[[1,2,0],[0,1,3],[2,1,0]];self.assertEqual([[im[r][c]-im[r+1][c+1] for c in range(2)] for r in range(2)],[[0,-1],[-1,1]])
        self.assertEqual(4*(3*3*3+1)+(36+1)*3,223)
        a=math.exp(math.sqrt(2))/(1+math.exp(math.sqrt(2)));self.assertEqual([round(2*a,3),round(4*(1-a),3)],[1.609,.782])
if __name__=='__main__':unittest.main()
