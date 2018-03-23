import imageio
import sys
import os

# global settings
img_list = None
out_file = None

i = 1
while (i < len(sys.argv)) :
    arg = sys.argv[i]

    if (arg == '--img_list' or arg == '-il') :
        img_list = sys.argv[i + 1]
        i += 1
    elif (arg == '--out_file' or arg == '-of') :
        out_file = sys.argv[i + 1]
        out_file = os.fsencode(out_file)
        i += 1

    i += 1

imgs = []

for file in img_list.split(','):
    img = imageio.imread(file)
    for frame in img:
        imgs.append(frame)

imageio.mimsave(out_file, imgs)
