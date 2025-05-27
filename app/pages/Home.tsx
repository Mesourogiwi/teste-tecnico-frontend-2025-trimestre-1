import type {Route} from './+types/home'
import AddressTable from '../components/organism/AddressTable'

export function meta({}: Route.MetaArgs) {
    return [
        {title: 'New React Router App'},
        {name: 'description', content: 'Welcome to React Router!'}
    ]
}

export default function Home() {
    return (
        <main className="flex pt-16 pb-4 m-8">
            <div className="flex-1 flex flex-col gap-16 min-h-0">
                <AddressTable />
            </div>
        </main>
    )
}
