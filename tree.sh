#!/bin/bash

# app 폴더의 하부 구조를 트리 형태로 출력하는 함수
print_tree() {
  local directory=$1
  local prefix=$2

  # 현재 디렉토리의 모든 파일과 폴더를 반복
  for file in "$directory"/*; do
    # 파일 이름 추출
    local filename=$(basename "$file")

    # 파일 또는 폴더 출력
    printf "%s+-- %s\n" "$prefix" "$filename"

    # 폴더인 경우 재귀적으로 하부 구조 출력
    if [ -d "$file" ]; then
      print_tree "$file" "$prefix|   "
    fi
  done
}

# app 폴더의 하부 구조 출력 시작
echo "app"
print_tree "app" ""