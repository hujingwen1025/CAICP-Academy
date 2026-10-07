import {equation, mathText} from './math.js';

export const matrixTex = rows => String.raw`\begin{bmatrix}${rows.map(r=>r.join(' & ')).join(String.raw`\\`)}\end{bmatrix}`;
const vector = a => matrixTex(a.map(x=>[x]));
const f=x=>Number(x.toFixed(4));

// Values come from the already validated/calculated lab, never code execution.
export function labMath(id,v,b) {
  const eq=tex=>equation(tex,true);
  if(id==='vectors')return eq(`A=${vector(v.a)},\\quad B=${vector(v.c)},\\quad M=${matrixTex([v.m.slice(0,2),v.m.slice(2)])}`)+eq(`A+B=${vector(v.sum)},\\quad A\\cdot B=${v.dot}`)+eq(`MA=${vector(v.product)},\\quad d(A,B)=${f(Math.hypot(...v.a.map((x,i)=>x-v.c[i])))}`);
  if(id==='probability')return `<p>${b('Two reds without replacement','不放回抽两红')}</p>`+eq(`P(R_1\\cap R_2)=${f(v.prob)}`)+`<p>${b('Two reds with replacement','放回抽两红')}</p>`+eq(`P(R_1\\cap R_2)=${f((v.r/(v.r+v.w))**2)}`)+`<p>${b('Condition given a positive test','检测阳性时状态为真')}</p>`+(v.denom?eq(`P(C\\mid +)=\\frac{P(+\\mid C)P(C)}{P(+)}=${f(v.prior*v.sens/v.denom*100)}\\%`):`<p>${b('Undefined: the conditioning event has zero probability.','未定义：条件事件概率为零。')}</p>`);
  if(id==='regression')return eq(`\\hat y=(${v.w})x+(${v.c})`)+eq(`\\hat{\\mathbf y}=${vector(v.pred.map(f))}`)+eq(`\\mathrm{MSE}=\\frac{1}{n}\\sum_i(\\hat y_i-y_i)^2=${f(v.mse)}`);
  if(id==='gradient')return eq(String.raw`L(w)=(w-3)^2,\qquad w_{t+1}=w_t-\eta\,2(w_t-3)`)+eq(`w=${f(v.w)},\\quad \\nabla L=${f(v.grad)},\\quad L=${f((v.w-3)**2)}`);
  if(id==='knn')return eq(String.raw`d(x,q)=\sqrt{\sum_j(x_j-q_j)^2}`)+v.nearest.map(a=>eq(`d(x_{${a.i+1}},q)=${f(a.d)}`)).join('');
  if(id==='kmeans')return eq(String.raw`\mu_c=\frac{1}{|C_c|}\sum_{x_i\in C_c}x_i`)+eq(`\\boldsymbol\\mu=${vector(v.r.centers.map(f))}`)+eq(`J=\\sum_i\\lVert x_i-\\mu_{c_i}\\rVert^2=${f(v.r.groups.reduce((s,g,i)=>s+g.reduce((z,x)=>z+(x-v.r.centers[i])**2,0),0))}`);
  if(id==='neuron')return eq(`z=w_1x_1+w_2x_2+b=${f(v.z)}`)+eq((v.activation==='sigmoid'?String.raw`h=\frac{1}{1+e^{-z}}`:v.activation==='relu'?String.raw`h=\max(0,z)`:'h=z')+`=${f(v.h)}`);
  if(id==='convolution')return eq(`n_{\\mathrm{out}}=\\left\\lfloor\\frac{3+2(${v.pad})-2}{${v.stride}}\\right\\rfloor+1=${v.out.length}`)+eq(`Y=${matrixTex(v.out)}`)+`<p>${b('Global max / average pooling','全局最大／平均池化')}</p>`+eq(`\\max Y=${Math.max(...v.flat)},\\quad \\mathrm{mean}(Y)=${f(v.flat.reduce((s,x)=>s+x,0)/v.flat.length)}`);
  if(id==='metrics')return Object.entries(v.r).map(([key,value])=>{
    const tex={accuracy:String.raw`\mathrm{Accuracy}=\frac{TP+TN}{TP+FP+FN+TN}`,precision:String.raw`\mathrm{Precision}=\frac{TP}{TP+FP}`,recall:String.raw`\mathrm{Recall}=\frac{TP}{TP+FN}`}[key];
    return value===null?eq(tex)+`<p>${b('Undefined: zero denominator.','未定义：分母为零。')}</p>`:eq(tex+`=${f(value*100)}\\%`);
  }).join('');
  return '';
}

export function labHelp(text){return mathText(text);}
