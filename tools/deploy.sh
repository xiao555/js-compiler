cd ../build
git init
git add -A
git commit -m 'deploy'
git push -f https://bitbucket.org/wtao/ltree.git master:master
