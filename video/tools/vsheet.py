import sys,glob
from PIL import Image
d=sys.argv[1]; cols=int(sys.argv[2]) if len(sys.argv)>2 else 6
fs=sorted(glob.glob(d+'/f*.png'))
ims=[Image.open(f).resize((360,640)) for f in fs]
rows=(len(ims)+cols-1)//cols
M=Image.new('RGB',(360*cols,640*rows))
for i,im in enumerate(ims): M.paste(im,((i%cols)*360,(i//cols)*640))
M.save(d+'/sheet.png'); print(len(ims))
