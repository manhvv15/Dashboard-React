
rm -rf publish/*
mkdir publish
repo=$1
version=$2
folder=$3
charts=$(find $folder -name "Chart.yaml")

for file in  $charts; do
  parentdir="$(dirname "$file")"
  helm package --app-version $version --version $version $parentdir -d publish
done

sleep 5

for helmpath in ./publish/*; do
  echo 'publish ' $helmpath $repo 
  helm cm-push $helmpath $repo
done

