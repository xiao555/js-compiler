if [[ "$1" = '--publish' ]]; then
  #statements
  echo 'publish starting'
  rm -rf tmp-tools
  git clone git@github.com:chenos/site-stone-tools.git tmp-tools
  cd tmp-tools
  git rm -rf *
  cp -rf ../tools/* ./
  git add .
  git commit -m "update tools"
  git push -f origin master
  rm -rf ../tmp-tools
  echo 'published'
fi

if [[ "$1" = '--sync' ]]; then
  rm -rf tools
  git clone --depth=1 --branch=master git@github.com:chenos/site-stone-tools.git tools
  rm -rf tools/.git
fi
