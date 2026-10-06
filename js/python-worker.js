// External runtime is optional. All core study features are local static assets.
const INDEX_URL='https://cdn.jsdelivr.net/pyodide/v314.0.7/full/';
let runtimePromise;
async function runtime(){if(!runtimePromise)runtimePromise=(async()=>{const {loadPyodide}=await import(INDEX_URL+'pyodide.mjs');return loadPyodide({indexURL:INDEX_URL});})().catch(e=>{runtimePromise=null;throw e;});return runtimePromise;}
self.onmessage=async({data})=>{
 let bytes=0, buffer='';
 const flush=()=>{if(buffer){self.postMessage({type:'stdout',text:buffer.trimEnd()});buffer='';}};
 try{
  self.postMessage({type:'status',status:'loading'});
  const py=await runtime();if(data.packages.length)await py.loadPackage(data.packages);
  const lines=data.input.replace(/\r\n/g,'\n').split('\n');if(!data.input)lines.length=0;
  py.setStdin({stdin:()=>lines.length?lines.shift():null});
  const output=text=>{bytes+=text.length;if(bytes<1024*1024){buffer+=text+'\n';if(buffer.length>=4096)flush();}};py.setStdout({batched:output});py.setStderr({batched:output});
  await py.loadPackagesFromImports(data.code);
  const wantPlots=data.packages.includes('matplotlib')||/(?:from|import)\s+matplotlib/.test(data.code);
  if(wantPlots)await py.runPythonAsync('import matplotlib\nmatplotlib.use("Agg")\nimport matplotlib.pyplot as plt\nplt.close("all")\nplt.show = lambda *args, **kwargs: None');
  self.postMessage({type:'status',status:'running'});
  const ns=py.toPy({__name__:'__main__'});
  try{await py.runPythonAsync(data.code,{globals:ns});}finally{ns.destroy();}
  let plots=[];
  if(wantPlots){
   const value=await py.runPythonAsync('import io, base64\n_plot_images = []\nfor _i in plt.get_fignums()[:6]:\n    _buf = io.BytesIO()\n    plt.figure(_i).savefig(_buf, format="png", dpi=110)\n    _plot_images.append(base64.b64encode(_buf.getvalue()).decode("ascii"))\nplt.close("all")\n_plot_images');plots=value.toJs();value.destroy();
  }
  flush();self.postMessage({type:'done',plots});
 }catch(e){flush();self.postMessage({type:'error',message:String(e)});}
};
