#!/bin/sh
set -e

WRAPPER_JAR=".mvn/wrapper/maven-wrapper.jar"
WRAPPER_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.3.2/maven-wrapper-3.3.2.jar"
MAVEN_URL="https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.8/apache-maven-3.9.8-bin.tar.gz"
MAVEN_HOME="${HOME}/.m2/wrapper/dists/apache-maven-3.9.8"

if [ ! -d "$MAVEN_HOME" ]; then
  mkdir -p "$MAVEN_HOME"
  if command -v curl > /dev/null 2>&1; then
    curl -sSfL "$MAVEN_URL" | tar xz -C "$MAVEN_HOME" --strip-components=1
  elif command -v wget > /dev/null 2>&1; then
    wget -qO- "$MAVEN_URL" | tar xz -C "$MAVEN_HOME" --strip-components=1
  else
    echo "Error: curl or wget is required" >&2
    exit 1
  fi
fi

exec "$MAVEN_HOME/bin/mvn" "$@"
