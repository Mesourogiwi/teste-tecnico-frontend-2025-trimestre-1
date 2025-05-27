import {useEffect, useState} from 'react'
import {toast} from 'sonner'
import {Plus, Trash2, Pencil} from 'lucide-react'
import {Button} from '../atoms/Button'
import {NavLink, useNavigate} from 'react-router'
import type {localStorageData} from '../../pages/FormUser'

export default function AddressTable() {
    const navigate = useNavigate()
    const [data, setData] = useState<localStorageData[]>([])
    const [filters, setFilters] = useState({
        name: '',
        addressName: '',
        localidade: '',
        uf: ''
    })

    useEffect(() => {
        const stored = localStorage.getItem('userAddress')
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                setData(Array.isArray(parsed) ? parsed : [parsed])
            } catch {
                toast.error('Erro ao carregar os dados salvos')
            }
        }
    }, [])

    const handleDelete = (index: number) => {
        const confirmed = window.confirm('Tem certeza que deseja excluir este endereço?')
        if (!confirmed) return

        const newData = [...data]
        newData.splice(index, 1)
        setData(newData)

        localStorage.setItem('formularioEndereco', JSON.stringify(newData))
        toast.success('Endereço removido com sucesso!')
    }

    const filteredData = data.filter(item => {
        return (
            item.id &&
            item?.name?.toLowerCase().includes(filters.name.toLowerCase()) &&
            item?.addressName?.toLowerCase().includes(filters.addressName.toLowerCase()) &&
            item?.localidade?.toLowerCase().includes(filters.localidade.toLowerCase()) &&
            item?.uf?.toLowerCase().includes(filters.uf.toLowerCase())
        )
    })

    return (
        <div className="max-w-6xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">Endereços Salvos</h2>

            <div className="grid grid-cols-4 gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Filtrar por Nome"
                    value={filters.name}
                    onChange={e => setFilters({...filters, name: e.target.value})}
                    className="p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Filtrar por Endereço"
                    value={filters.addressName}
                    onChange={e => setFilters({...filters, addressName: e.target.value})}
                    className="p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Filtrar por Cidade"
                    value={filters.localidade}
                    onChange={e => setFilters({...filters, localidade: e.target.value})}
                    className="p-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Filtrar por Estado"
                    value={filters.uf}
                    onChange={e => setFilters({...filters, uf: e.target.value})}
                    className="p-2 border rounded"
                />
            </div>

            {filteredData.length === 0 ? (
                <p className="text-gray-600">Nenhum endereço encontrado.</p>
            ) : (
                <div className="overflow-auto">
                    <table className="w-full text-left border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2">ID</th>
                                <th className="p-2">Nome</th>
                                <th className="p-2">Endereço</th>
                                <th className="p-2">CEP</th>
                                <th className="p-2">Rua</th>
                                <th className="p-2">Bairro</th>
                                <th className="p-2">Cidade</th>
                                <th className="p-2">Estado</th>
                                <th className="p-2">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={index} className="border-t border-gray-200">
                                    <td className="p-2"> {item.id}</td>
                                    <td className="p-2">{item.name}</td>
                                    <td className="p-2">{item.addressName}</td>
                                    <td className="p-2">{item.cep}</td>
                                    <td className="p-2">{item.logradouro}</td>
                                    <td className="p-2">{item.bairro}</td>
                                    <td className="p-2">{item.localidade}</td>
                                    <td className="p-2">{item.uf}</td>
                                    <td className="p-2 text-center flex gap-2">
                                        <Button
                                            iconOnly
                                            iconSize={'sm'}
                                            size="sm"
                                            icon={Pencil}
                                            onClick={() => navigate(`/formUser/${item.id}`)}
                                        />
                                        <Button
                                            variant={'error'}
                                            iconOnly
                                            iconSize={'sm'}
                                            size="sm"
                                            icon={Trash2}
                                            onClick={() => handleDelete(index)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="flex justify-end mt-4">
                <NavLink to={'/formUser'}>
                    <Button variant={'success'} iconOnly iconSize={'md'} size="md" icon={Plus} />
                </NavLink>
            </div>
        </div>
    )
}
