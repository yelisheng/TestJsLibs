git reset --hard
git pull
bash tsctree.sh
cnpm install
forever start -c "/bin/bash" start.sh