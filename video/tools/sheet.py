import sys,glob
from PIL import Image
d=sys.argv[1]; cols=int(sys.argv[2]) if len(sys.argv)>2 else 3
fs=sorted(glob.glob(d+'/f*.png'))
ims=[Image.open(f).resize((640,360)) for f in fs]
rows=(len(ims)+cols-1)//cols
M=Image.new('RGB',(640*cols,360*rows))
for i,im in enumerate(ims): M.paste(im,((i%cols)*640,(i//cols)*360))
M.save(d+'/sheet.png'); print(len(ims))
