import numpy as np
from PIL import Image
def join_img(files):
    basemat=None
    for f in files:
        if basemat is None:
            basemat=np.atleast_2d(Image.open(f))
        else:
            basemat=np.append(basemat,np.atleast_2d(Image.open(f)),axis=0)
    return Image.fromarray(basemat)


if __name__ == '__main__':
    import os
    files = os.listdir(".")
    img=join_img(files)
    img.save('ready.png')
