import {type RouteConfig, index, route} from '@react-router/dev/routes'

export default [
    index('pages/Home.tsx'),
    route('formUser/:id?', 'pages/FormUser.tsx')
] satisfies RouteConfig
