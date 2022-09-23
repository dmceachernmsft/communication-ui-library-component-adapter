# Communicaton UI library Component Adapters

### The Goal

The goal of this repo is to show how we might use the `AzureCommunicationCallAdapter` with a component application. This shows that we can give contoso the ability to create their own composite like experience leveraging the power of our adapters. 

Changes to the UI library that were made to make this work were: 
- Expose the `CallAdapterProvider` from the react-composites package.
- Expose the composite version of `usePropsFor` as `usePropsForComposite` to allow contoso to manage the data and handlers of their components. 

## pre-requisites

- node v14 - v17

## Dependency Note:
If you are sintalling the packages on Mac or Linux you will need to update:
```json
"@azure/communication-react": ".\\deps\\azure-communication-react-1.3.2-beta.0-with-provider.tgz",
```
to be: 
```json
"@azure/communication-react": "./deps/azure-communication-react-1.3.2-beta.0-with-provider.tgz",
```

## Getting started

To get started run the following:

1. setup yarn on your machine

```bash
npm install -g yarn
```

2. install the dependencies
```bash
yarn
```

3. Run the app
```bash 
yarn start
```
