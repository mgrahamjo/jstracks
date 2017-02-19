!/bin/bash

FAILED=()

print_blue() {
  printf "\e[36m$1\e[0m\n"
}

print_red() {
  printf "\e[31m$1\e[0m\n"
}

print_green() {
  printf "\e[32m$1\e[0m\n"
}

attempt() {
  printf "$1... "
  STEP="$1"
}

success() {
  print_blue "✓ $STEP"
}

fail() {
  print_red "✖ $STEP failed.\n"
  FAILED+=("$STEP")
}

check_status() {
  if [ ${#FAILED[@]} -eq 0 ]; then
      print_blue "✓ Build succeeded"
      return 0
  else
      print_red "✖ Build failed:"
      print_red "  > ${FAILED[@]}"
      return 1
  fi
}

cd_to_root() {
  cd "$(dirname "$0")" && cd ..
}

missing() {
  if command -v $1 >/dev/null 2>&1; then
    print_blue "$1 is already installed"
    return 1
  else
    print_blue "installing $1..."
    return 0
  fi
}
