# Herdenk-frontend

**Author:** *José Baars*\
**Version:** *1.0*\
**Date** 13 November 2021

## 

# Contents 

Contents

Introduction

Download

Versions and dependencies

Installation

Run

Deployment

## Introduction

Herdenk-frontend is the frontend of the Herdenk (Remembrance)
application. Herdenk is a virtual graveyard, which allows registered
users to make a grave or remembrance page for a loved one, a pet or
maybe a holiday and for other users to place reactions or memories.

Herdenk-frontend is a React single page application, apart from React
libraries no other software has been used. For the setup
create-react-app has been used.

## Download

The application can be downloaded from github from
[here](https://github.com/gitpeut/herdenk-frontend)

The backend application can also be downloaded from github,
[here](https://github.com/gitpeut/herdenk)

(Please refer to the README.md of the backend application for it's own
installation instructions)

## Versions and dependencies

The application was built using Webstorm. Find a list of versions of the
software used below

        "axios": "^0.24.0",
        "jwt-decode": "^3.1.2",
        "react": "^17.0.2",
        "react-dom": "^17.0.2",
        "react-hook-form": "^7.19.1",
        "react-router-dom": "^5.3.0",
        "react-scripts": "4.0.3",
        "web-vitals": "^1.1.2"

## Installation

This is alll covered by the NPM package manager, after downloading the
project, just run

    npm install

Before tryig to the backend host details must be entered in the file
.env in the top directry of the project. In the the host and portnumber
have to be defined like this (this was the configuration used during
development)

    REACT_APP_BACKEND=localhost:40545

## Run

Start the application by entering

    npm start

## Deployment

Deployment of this app differs greatly depending on the hosting
environment used, see instructions for several (cloud) application
servers [here](https://create-react-app.dev/docs/deployment/) and for
Apache
[here](https://stackoverflow.com/questions/42461279/how-to-deploy-a-react-app-on-apache-web-server)
