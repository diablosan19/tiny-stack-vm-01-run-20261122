import{mkdirSync,readdirSync,readFileSync,writeFileSync}from'node:fs';
import{join}from'node:path';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
// [immediate bytes, pops, pushes] per opcode; anything else is trap 5.
const M:{[k:number]:[number,number,number]}={
0:[0,0,0],1:[1,0,1],2:[4,0,1],3:[0,1,0],4:[0,1,2],5:[0,2,2],6:[0,2,3],7:[0,3,3],
16:[0,2,1],17:[0,2,1],18:[0,2,1],19:[0,2,1],20:[0,2,1],21:[0,2,1],22:[0,2,1],
23:[0,1,1],24:[0,2,1],25:[0,2,1],26:[0,2,1],27:[0,1,1],28:[0,2,1],29:[0,2,1],
30:[0,2,1],32:[0,2,1],33:[0,2,1],34:[0,2,1],
48:[2,0,0],49:[2,1,0],50:[2,1,0],51:[2,0,0],52:[0,0,0],
64:[0,1,1],65:[0,2,0],80:[0,1,0],81:[0,1,0],82:[0,0,1],83:[0,1,0]};
function run(P:Uint8Array,N:Uint8Array):[number,Uint8Array]{
 const n=P.length,D=new Int32Array(256),C=new Int32Array(64),W=new Int32Array(256),U=new Uint8Array(65536);
 let s=0,c=0,p=0,t=0,q=0,l=0;
 const end=(e:number):[number,Uint8Array]=>[e,U.subarray(0,l)];
 for(;;){
  if(t===1e6)return end(10);
  if(p<0||p>=n)return end(9);
  const o=P[p],m=M[o];
  if(!m)return end(5);
  const[im,a,b]=m;
  if(p+im>=n)return end(9);
  t++;const nx=p+1+im;
  if(s<a)return end(2);
  if(s-a+b>256)return end(3);
  p=nx;
  switch(o){
   case 0:return[0,U.subarray(0,l)];
   case 1:D[s++]=(P[nx-1]<<24)>>24;break;
   case 2:D[s++]=P[nx-4]|(P[nx-3]<<8)|(P[nx-2]<<16)|(P[nx-1]<<24);break;
   case 3:s--;break;
   case 4:D[s]=D[s-1];s++;break;
   case 5:{const v=D[s-1];D[s-1]=D[s-2];D[s-2]=v;break}
   case 6:D[s]=D[s-2];s++;break;
   case 7:{const v=D[s-3];D[s-3]=D[s-2];D[s-2]=D[s-1];D[s-1]=v;break}
   case 23:D[s-1]=(-D[s-1])|0;break;
   case 27:D[s-1]=~D[s-1];break;
   case 16:case 17:case 18:case 19:case 20:case 21:case 22:case 24:case 25:
   case 26:case 28:case 29:case 30:case 32:case 33:case 34:{
    const y=D[s-1],x=D[s-2];let r=0;
    if(o===16)r=(x+y)|0;
    else if(o===17)r=(x-y)|0;
    else if(o===18)r=Math.imul(x,y);
    else if(o===19){if(!y)return end(4);r=x===-2147483648&&y===-1?x:(x/y)|0}
    else if(o===20){if(!y)return end(4);r=y===-1?0:(x%y)|0}
    else if(o===21){if(!y)return end(4);r=Math.floor((x>>>0)/(y>>>0))|0}
    else if(o===22){if(!y)return end(4);r=((x>>>0)%(y>>>0))|0}
    else if(o===24)r=x&y;
    else if(o===25)r=x|y;
    else if(o===26)r=x^y;
    else if(o===28)r=x<<(y&31);
    else if(o===29)r=x>>(y&31);
    else if(o===30)r=(x>>>(y&31))|0;
    else if(o===32)r=x===y?1:0;
    else if(o===33)r=x<y?1:0;
    else r=(x>>>0)<(y>>>0)?1:0;
    s-=2;D[s++]=r;break}
   case 48:case 49:case 50:{
    const rel=((P[nx-2]|(P[nx-1]<<8))<<16)>>16;let take=o===48;
    if(o!==48){const v=D[--s];take=o===49?v===0:v!==0}
    if(take)p=nx+rel;break}
   case 51:
    if(c===64)return end(7);
    C[c++]=nx;p=P[nx-2]|(P[nx-1]<<8);break;
   case 52:
    if(!c)return end(8);
    p=C[--c];break;
   case 64:{const v=D[s-1];if(v<0||v>255)return end(6);D[s-1]=W[v];break}
   case 65:{const v=D[s-1];if(v<0||v>255)return end(6);s-=2;W[v]=D[s];break}
   case 80:{const g=String(D[s-1]);if(l+g.length>65536)return end(11);s--;for(let i=0;i<g.length;i++)U[l++]=g.charCodeAt(i);break}
   case 81:if(l>=65536)return end(11);U[l++]=D[--s]&255;break;
   case 82:D[s++]=q<N.length?N[q++]:-1;break;
   case 83:return[D[--s]&255,U.subarray(0,l)];
   default:return end(5);
  }
 }
}
for(const id of readdirSync(I).sort()){
 const[code,out]=run(new Uint8Array(readFileSync(join(I,id,'program.bin'))),new Uint8Array(readFileSync(join(I,id,'input.bin'))));
 mkdirSync(join(O,id),{recursive:true});
 writeFileSync(join(O,id,'stdout.bin'),out);
 writeFileSync(join(O,id,'exit.txt'),code+'\n');
}
