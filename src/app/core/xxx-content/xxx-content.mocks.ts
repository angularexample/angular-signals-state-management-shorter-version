import { XxxContentType, XxxContentStatus, XxxContentApi } from './xxx-content-types';

export const mockContentHome: XxxContentType = {
  contentModel: {
    bodyText: 'Hello World, this is the body text for home',
    pageTitle: 'Home',
  },
  key: 'home',
  status: XxxContentStatus.LOADED
}

export const mockContentApiHome: XxxContentApi = {
  contentModel: {
    bodyText: 'Hello World, this is the body text for home',
    pageTitle: 'Home',
  },
  key: 'home'
}


export const mockContentApiEmpty: XxxContentApi = {
  contentModel: {},
  key: 'empty'
}

export const mockContentEmpty: XxxContentType = {
  contentModel: {},
  key: 'empty',
  status: XxxContentStatus.EMPTY
}
