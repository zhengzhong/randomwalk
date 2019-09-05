# Frontend

## Building

To build a development version:

    $ npm run build

To build a production version:

    $ npm run build:prod

Following Django's static files convention, the compiled bundle files will be generated in
`static/frontend/dist`. The output directory is defined in `webpack.common.js`.


## Checking dependencies

To list installed vendor packages in `node_modules`:

    $ npm ls --depth=0

To check for outdated packages:

    $ npm outdated

To update all outdated packages to the latest version:

    $ npm update


## Linting

To run ESLint:

    $ npm run lint

The ESLint report will be generated in `build/eslint.html`.
