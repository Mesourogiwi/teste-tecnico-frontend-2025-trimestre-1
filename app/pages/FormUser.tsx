import {useEffect, useState} from 'react'
import {toast, Toaster} from 'sonner'
import {useNavigate, useParams} from 'react-router'
import {Button} from '../components/atoms/Button'

export type localStorageData = {
    id: number
    name: string
    addressName: string
    cep: string
    logradouro: string
    bairro: string
    localidade: string
    uf: string
}
export default function AddressForm() {
    const [form, setForm] = useState({
        name: '',
        addressName: '',
        cep: '',
        logradouro: '',
        bairro: '',
        localidade: '',
        uf: ''
    })

    const navigate = useNavigate()

    const {id} = useParams()

    useEffect(() => {
        if (id) {
            const stored = localStorage.getItem('userAddress')
            if (!stored) return

            try {
                const parsed: localStorageData[] = JSON.parse(stored)
                const existingData = parsed.find(item => item.id === Number(id))

                if (existingData) {
                    setForm(existingData)
                }
            } catch {
                toast.error('Erro ao carregar dados para edição')
            }
        }
    }, [id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {id, value} = e.target
        const newValue = id === 'cep' ? formatCep(value) : value
        setForm(prev => ({...prev, [id]: newValue}))
    }

    const isValidCep = (cep: string) => /^\d{5}-?\d{3}$/.test(cep)

    const formatCep = (value: string) => {
        const numeric = value.replace(/\D/g, '')
        if (numeric.length <= 5) return numeric
        return numeric.slice(0, 5) + '-' + numeric.slice(5, 8)
    }

    const handleCepSearch = async () => {
        const rawCep = form.cep.replace(/\D/g, '')

        if (!isValidCep(form.cep)) {
            toast.error('CEP inválido. Use o formato 99999-999')
            return
        }

        try {
            const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`)
            const data = await res.json()

            if (data.erro) throw new Error('CEP não encontrado')

            setForm(prev => ({
                ...prev,
                logradouro: data.logradouro,
                bairro: data.bairro,
                localidade: data.localidade,
                uf: data.uf
            }))

            toast.success('Endereço preenchido com sucesso!')
        } catch (error) {
            toast.error('Erro ao buscar o CEP')
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const {name, addressName, cep, logradouro, bairro, localidade, uf} = form

        const isComplete = [name, addressName, cep, logradouro, bairro, localidade, uf].every(
            val => val.trim() !== ''
        )

        if (!isComplete) {
            toast.error('Preencha todos os campos antes de enviar')
            return
        }

        const storedData = localStorage.getItem('userAddress')
        const parsed: localStorageData[] = storedData ? JSON.parse(storedData) : []

        console.log('id', id)

        let updated

        const index = parsed.findIndex(item => item.id === Number(id))
        if (index !== -1) {
            parsed[index] = {...form, id: Number(id)}
            updated = [...parsed]
        } else {
            updated = [...parsed, {...form, id: parsed.length + 1}]
        }

        localStorage.setItem('userAddress', JSON.stringify(updated))

        toast.success('Dados salvos')

        navigate('/')
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <Toaster richColors position="top-center" />
            <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-md">
                <h1 className="text-xl font-semibold text-gray-800 mb-6">Formulário de Endereço</h1>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        id="name"
                        placeholder="Nome do usuário"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 p-2 rounded-md"
                    />

                    <input
                        type="text"
                        id="addressName"
                        placeholder="Nome do endereço"
                        value={form.addressName}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 p-2 rounded-md"
                    />

                    <div className="flex gap-2">
                        <input
                            type="text"
                            id="cep"
                            placeholder="CEP"
                            value={form.cep}
                            onChange={handleChange}
                            required
                            className="flex-1 border border-gray-300 p-2 rounded-md"
                        />
                        <Button type={'button'} variant="info" onClick={handleCepSearch}>
                            Buscar CEP
                        </Button>
                    </div>

                    <input
                        type="text"
                        id="logradouro"
                        placeholder="Rua"
                        value={form.logradouro}
                        readOnly
                        className="w-full border border-gray-200 bg-gray-100 p-2 rounded-md"
                    />
                    <input
                        type="text"
                        id="bairro"
                        placeholder="Bairro"
                        value={form.bairro}
                        readOnly
                        className="w-full border border-gray-200 bg-gray-100 p-2 rounded-md"
                    />
                    <input
                        type="text"
                        id="localidade"
                        placeholder="Cidade"
                        value={form.localidade}
                        readOnly
                        className="w-full border border-gray-200 bg-gray-100 p-2 rounded-md"
                    />
                    <input
                        type="text"
                        id="uf"
                        placeholder="Estado"
                        value={form.uf}
                        readOnly
                        className="w-full border border-gray-200 bg-gray-100 p-2 rounded-md"
                    />
                    <Button type="submit" fullWidth variant="success">
                        Salvar endereço
                    </Button>
                </form>
            </div>
        </div>
    )
}
