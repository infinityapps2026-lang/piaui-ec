'use client'

import { useActionState } from 'react'
import { cadastrarSocio, type FormState } from '../actions'

const PLANOS_PF = ['Iniciante', 'Vibrante+', 'Vibrante Plus']
const PLANOS_PJ = ['Bronze', 'Ouro', 'Master']

const INPUT = 'w-full px-4 py-3.5 text-sm text-white placeholder-pec-cinza/60 focus:outline-none focus:ring-1 focus:ring-pec-vermelho transition-colors'
const INPUT_BG = { background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)' }

export default function SocioPublicoForm({ planoInicial }: { planoInicial: string }) {
  const [state, action, isPending] = useActionState<FormState, FormData>(cadastrarSocio, null)

  return (
    <form action={action} className="space-y-5">
      {state?.error && (
        <div className="px-4 py-3 text-sm font-semibold text-white" style={{ background: 'rgba(227,6,19,.2)', border: '1px solid rgba(227,6,19,.4)' }}>
          {state.error}
        </div>
      )}

      {/* Nome */}
      <div>
        <label className="block text-[11px] tracking-[.2em] uppercase font-bold text-pec-cinza mb-2">
          Nome completo *
        </label>
        <input
          name="nome_completo"
          required
          placeholder="Seu nome completo"
          className={INPUT}
          style={INPUT_BG}
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-[11px] tracking-[.2em] uppercase font-bold text-pec-cinza mb-2">
          E-mail *
        </label>
        <input
          name="email"
          type="email"
          required
          placeholder="seu@email.com"
          className={INPUT}
          style={INPUT_BG}
        />
      </div>

      {/* Telefone */}
      <div>
        <label className="block text-[11px] tracking-[.2em] uppercase font-bold text-pec-cinza mb-2">
          WhatsApp / Telefone
        </label>
        <input
          name="telefone"
          placeholder="(86) 99999-9999"
          className={INPUT}
          style={INPUT_BG}
        />
      </div>

      {/* CPF */}
      <div>
        <label className="block text-[11px] tracking-[.2em] uppercase font-bold text-pec-cinza mb-2">
          CPF
        </label>
        <input
          name="cpf"
          placeholder="000.000.000-00"
          className={INPUT}
          style={INPUT_BG}
        />
      </div>

      {/* Plano */}
      <div>
        <label className="block text-[11px] tracking-[.2em] uppercase font-bold text-pec-cinza mb-2">
          Plano escolhido *
        </label>
        <select
          name="plano"
          required
          defaultValue={planoInicial}
          className={INPUT}
          style={{ ...INPUT_BG, appearance: 'none' }}
        >
          <option value="" disabled>Selecione o plano...</option>
          <optgroup label="Pessoa Física">
            {PLANOS_PF.map((p) => (
              <option key={p} value={p} style={{ background: '#050f2c' }}>{p}</option>
            ))}
          </optgroup>
          <optgroup label="Empresas">
            {PLANOS_PJ.map((p) => (
              <option key={p} value={p} style={{ background: '#050f2c' }}>{p}</option>
            ))}
          </optgroup>
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-4 text-[12px] tracking-[.2em] uppercase font-bold text-white transition-all disabled:opacity-60"
        style={{ background: isPending ? 'rgba(227,6,19,.6)' : '#e30613' }}
      >
        {isPending ? 'Enviando...' : 'Quero ser sócio →'}
      </button>

      <p className="text-[11px] text-pec-cinza text-center leading-relaxed">
        Ao se cadastrar, nossa equipe entrará em contato para confirmar sua adesão e orientar o pagamento.
      </p>
    </form>
  )
}
