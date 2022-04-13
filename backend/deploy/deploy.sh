#!/bin/bash
set -e

### Configuration ###

APP_DIR=~/projects/kebek-backend

### Automation steps ###

cd $APP_DIR/

# Using predefined set of commands from Makefile
# First updating the codebase of the project
# Then building the new version and starting the app

make pull
make deploy
