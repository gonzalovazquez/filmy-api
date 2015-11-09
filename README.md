filmy-api
[![Build Status](https://travis-ci.org/gonzalovazquez/filmy-api.svg?branch=master)](https://travis-ci.org/gonzalovazquez/filmy-api)
[![Code Climate](https://codeclimate.com/github/gonzalovazquez/filmy-api/badges/gpa.svg)](https://codeclimate.com/github/gonzalovazquez/filmy-api)
[![Test Coverage](https://codeclimate.com/github/gonzalovazquez/filmy-api/badges/coverage.svg)](https://codeclimate.com/github/gonzalovazquez/filmy-api/coverage)
==========

API Endpoint for Filmy


node app -PRODUCTION
mongod --dbpath=/Users/gv/Projects/mongodb-2.6.3/data/


Sign up
http --verbose POST :5000/signin email=gonzalo.segura3@gmail.com password=superpassword



Authorize a user
http --verbose GET :5000/me 'authorization:eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfX3YiOjAsInBhc3N3b3JkIjoic3VwZXJwYXNzd29yZCIsImVtYWlsIjoiZ29uemFsby5zZWd1cmEzQGdtYWlsLmNvbSIsIl9pZCI6IjU2M2Y4ODIyNmM3YTIwN2EwOTdmNjNmZSIsIm1vdmllcyI6W119.H7ZBtmjDOhzsZW0Lyjga7dIfiVohWc0d_PPxlEjJZR0'


Add movies
http --verbose POST :5000/api/films 'authorization:eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfX3YiOjAsInBhc3N3b3JkIjoic3VwZXJwYXNzd29yZCIsImVtYWlsIjoiZ29uemFsby5zZWd1cmEzQGdtYWlsLmNvbSIsIl9pZCI6IjU2M2Y4ODIyNmM3YTIwN2EwOTdmNjNmZSIsIm1vdmllcyI6W119.H7ZBtmjDOhzsZW0Lyjga7dIfiVohWc0d_PPxlEjJZR0' year=1234 rated=123 released=123 runtime=123 title=pulp
