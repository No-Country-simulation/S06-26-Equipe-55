#!/bin/sh
set -e
MAVEN_HOME="${HOME}/.m2/wrapper/dists/apache-maven-3.9.8"
if [ ! -d "$MAVEN_HOME" ]; then
  mkdir -p "$MAVEN_HOME"
  curl -sL "https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.8/apache-maven-3.9.8-bin.tar.gz" | tar xz -C "$MAVEN_HOME" --strip-components=1
fi
exec "$MAVEN_HOME/bin/mvn" "$@"
