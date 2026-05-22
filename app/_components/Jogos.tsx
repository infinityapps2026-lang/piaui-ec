import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Jogo = {
  id: string
  competicao: string
  rodada: string | null
  data_jogo: string | null
  estadio: string | null
  mandante: boolean
  adversario: string
  adversario_uf: string | null
  escudo_pec_url: string | null
  adversario_escudo_url: string | null
  placar_pec: number | null
  placar_adversario: number | null
  status: string
  link_ingresso: string | null
}

type TimeClassificacao = {
  id: string
  grupo: string
  pos: number
  nome: string
  pts: number
  j: number
  v: number
  e: number
  d: number
  sg: string
  classified: boolean
  highlight: boolean
}

type Props = {
  proximoJogo: Jogo | null
  jogosRecentes: Jogo[]
  classificacao: TimeClassificacao[]
}

const PEC_LOGO = '/imagem/logo.png'

function TeamShield({ url, nome, fallbackColor = '#334155' }: { url: string | null; nome: string; fallbackColor?: string }) {
  const src = url ?? (nome === 'Piauí EC' ? PEC_LOGO : null)
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={`Escudo ${nome}`} className="w-full h-full object-contain" />
    )
  }
  const initials = nome.slice(0, 3).toUpperCase()
  return (
    <svg viewBox="0 0 100 120" className="w-full h-full">
      <path d="M50 3 L97 18 L97 65 Q97 100 50 117 Q3 100 3 65 L3 18 Z" fill={fallbackColor} stroke="#fff" strokeWidth="1.5" />
      <text x="50" y="75" textAnchor="middle" fontFamily="Archivo Black" fontSize="20" fill="#fff">{initials}</text>
    </svg>
  )
}

function resultadoJogo(j: Jogo): 'win' | 'loss' | 'draw' | 'upcoming' {
  if (j.status !== 'encerrado') return 'upcoming'
  if (j.placar_pec === null || j.placar_adversario === null) return 'upcoming'
  if (j.placar_pec > j.placar_adversario) return 'win'
  if (j.placar_pec < j.placar_adversario) return 'loss'
  return 'draw'
}

const RESULTADO_STYLE = {
  win:     { label: 'Vitória',  card: 'border-l-[#4ade80]', badge: 'bg-[rgba(74,222,128,.15)] text-[#4ade80]' },
  loss:    { label: 'Derrota', card: 'border-l-pec-vermelho', badge: 'bg-pec-vermelho/15 text-pec-vermelho' },
  draw:    { label: 'Empate',  card: 'border-l-pec-amarelo', badge: 'bg-pec-amarelo/15 text-pec-amarelo' },
  upcoming:{ label: 'A jogar', card: 'border-l-blue-400', badge: 'bg-blue-400/15 text-blue-400' },
}

export default function Jogos({ proximoJogo, jogosRecentes, classificacao }: Props) {
  return (
    <section
      id="jogos"
      className="py-[140px] px-6 md:px-12 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #050f2c 0%, #02060f 100%)',
      }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Section header */}
      <div className="max-w-[1380px] mx-auto mb-[50px] grid grid-cols-1 md:grid-cols-[auto_1fr] gap-16 items-end relative z-10">
        <span
          className="font-bebas text-[120px] leading-none"
          style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(227,6,19,.3)' }}
        >
          02
        </span>
        <div>
          <div className="text-pec-vermelho text-[11px] tracking-[.3em] font-bold uppercase mb-3.5">Em campo</div>
          <h2 className="font-bebas text-[clamp(48px,5vw,84px)] leading-[.95] uppercase text-white">
            Jogos &amp; <span className="text-pec-vermelho">tabela</span><br />Copa do Nordeste 2026
          </h2>
        </div>
      </div>

      {/* Main content: próximo jogo + classificação */}
      <div className="max-w-[1380px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8">

        {/* Próximo jogo */}
        {proximoJogo ? (
          <ProximoJogo jogo={proximoJogo} />
        ) : (
          <div
            className="border border-pec-vermelho/40 p-9 flex items-center justify-center"
            style={{ background: 'linear-gradient(160deg, rgba(227,6,19,.15) 0%, rgba(10,31,79,.7) 60%)' }}
          >
            <p className="text-pec-cinza text-center">Nenhum jogo agendado no momento.</p>
          </div>
        )}

        <TabelaClassificacao times={classificacao} />
      </div>

      {/* Lista de jogos */}
      {jogosRecentes.length > 0 && (
        <div className="max-w-[1380px] mx-auto mt-16 relative z-10">
          <div className="font-archivo font-black text-[14px] tracking-[.15em] uppercase text-white mb-6 flex items-center gap-3.5 after:content-[''] after:flex-1 after:h-px after:bg-white/10">
            Últimos resultados &amp; próximas partidas
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {jogosRecentes.map((j) => (
              <MatchCard key={j.id} jogo={j} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function ProximoJogo({ jogo }: { jogo: Jogo }) {
  const timeCasa = jogo.mandante ? 'Piauí EC' : jogo.adversario
  const timeVisita = jogo.mandante ? jogo.adversario : 'Piauí EC'
  const data = jogo.data_jogo ? new Date(jogo.data_jogo) : null

  return (
    <div
      className="border border-pec-vermelho/40 p-9 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, rgba(227,6,19,.15) 0%, rgba(10,31,79,.7) 60%)' }}
    >
      <div
        className="absolute font-bebas text-[200px] text-white/[.025] top-[-30px] right-[-20px] leading-none tracking-tight pointer-events-none select-none"
      >
        PRÓXIMO
      </div>

      <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-pec-vermelho text-white text-[10px] tracking-[.25em] font-bold uppercase mb-6">
        <span className="w-1.5 h-1.5 bg-white rounded-full animate-blink" />
        Próximo jogo
      </div>

      <div className="text-pec-amarelo text-[11px] tracking-[.25em] uppercase font-bold mb-2">
        {jogo.competicao}
      </div>
      {jogo.rodada && (
        <div className="text-pec-cinza text-xs mb-8">{jogo.rodada}</div>
      )}

      {/* Versus */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-center mb-8">
        <div className="text-center">
          <div className="w-20 h-[90px] mx-auto mb-3.5">
            {jogo.mandante
              ? <TeamShield url={jogo.escudo_pec_url} nome="Piauí EC" />
              : <TeamShield url={jogo.adversario_escudo_url} nome={jogo.adversario} />}
          </div>
          <div className="font-archivo font-black text-[15px] uppercase leading-tight text-white">{timeCasa}</div>
          <div className="text-[10px] text-pec-cinza tracking-[.15em] uppercase mt-1">
            {jogo.mandante ? 'Mandante' : `Visitante · ${jogo.adversario_uf ?? ''}`}
          </div>
        </div>

        <div className="font-bebas text-[42px] text-pec-vermelho leading-none">×</div>

        <div className="text-center">
          <div className="w-20 h-[90px] mx-auto mb-3.5">
            {jogo.mandante
              ? <TeamShield url={jogo.adversario_escudo_url} nome={jogo.adversario} />
              : <TeamShield url={jogo.escudo_pec_url} nome="Piauí EC" />}
          </div>
          <div className="font-archivo font-black text-[15px] uppercase leading-tight text-white">{timeVisita}</div>
          <div className="text-[10px] text-pec-cinza tracking-[.15em] uppercase mt-1">
            {!jogo.mandante ? 'Mandante' : `Visitante · ${jogo.adversario_uf ?? ''}`}
          </div>
        </div>
      </div>

      {/* Info */}
      <div
        className="grid grid-cols-3 gap-3.5 pt-6 border-t border-white/10 mb-7"
      >
        {data && (
          <div className="text-center">
            <div className="text-[9px] tracking-[.2em] text-pec-cinza uppercase mb-1.5">Data</div>
            <div className="font-archivo font-bold text-[13px] text-white">
              <strong className="font-bebas text-2xl text-pec-vermelho block leading-none">{format(data, 'dd', { locale: ptBR })}</strong>
              {format(data, 'MMMM · EEE', { locale: ptBR }).toUpperCase()}
            </div>
          </div>
        )}
        {data && (
          <div className="text-center">
            <div className="text-[9px] tracking-[.2em] text-pec-cinza uppercase mb-1.5">Horário</div>
            <div className="font-archivo font-bold text-[13px] text-white">
              <strong className="font-bebas text-2xl text-pec-vermelho block leading-none">{format(data, 'HH:mm')}</strong>
              HORÁRIO BR
            </div>
          </div>
        )}
        {jogo.estadio && (
          <div className="text-center">
            <div className="text-[9px] tracking-[.2em] text-pec-cinza uppercase mb-1.5">Estádio</div>
            <div className="font-archivo font-bold text-[13px] text-white leading-snug">{jogo.estadio}</div>
          </div>
        )}
      </div>

      <div className="flex gap-2.5 flex-wrap">
        {jogo.link_ingresso && (
          <a
            href={jogo.link_ingresso}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-4 text-[11px] tracking-[.18em] uppercase font-bold bg-pec-vermelho text-white hover:bg-pec-vermelho-deep transition-colors no-underline"
          >
            Comprar ingresso →
          </a>
        )}
        <a
          href="#jogos"
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-4 text-[11px] tracking-[.18em] uppercase font-bold border border-white/25 text-white hover:border-pec-vermelho hover:text-pec-vermelho transition-colors no-underline"
        >
          Ver detalhes
        </a>
      </div>
    </div>
  )
}

function TabelaClassificacao({ times }: { times: TimeClassificacao[] }) {
  const grupo = times[0]?.grupo ?? 'B'

  if (times.length === 0) {
    return (
      <div
        className="border border-white/[.08] p-8 flex items-center justify-center"
        style={{ background: 'rgba(10,31,79,.4)' }}
      >
        <p className="text-pec-cinza text-center text-sm">Classificação não disponível.</p>
      </div>
    )
  }

  return (
    <div
      className="border border-white/[.08] p-8"
      style={{ background: 'rgba(10,31,79,.4)' }}
    >
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/[.08]">
        <span className="font-archivo font-black text-[14px] tracking-[.15em] uppercase text-white">Classificação</span>
        <span className="text-[10px] tracking-[.2em] text-pec-amarelo uppercase font-bold px-3 py-1.5 border border-pec-amarelo/40">
          Grupo {grupo}
        </span>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {['Time','P','J','V','E','D','SG'].map((h, i) => (
              <th
                key={h}
                className={`text-[10px] tracking-[.15em] text-pec-cinza uppercase font-semibold py-2.5 px-1 border-b border-white/[.08] ${i === 0 ? 'text-left pl-0' : 'text-center'}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((t) => (
            <tr
              key={t.nome}
              className={t.highlight ? 'bg-pec-vermelho/[.08]' : ''}
              style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}
            >
              <td className="py-3.5 px-1 pl-0 text-[13px] font-semibold font-archivo">
                <span
                  className={`inline-flex items-center justify-center w-[22px] h-[22px] font-bebas text-[14px] mr-2.5 ${
                    t.classified ? 'bg-[rgba(74,222,128,.18)] text-[#4ade80]' :
                    t.highlight ? 'bg-pec-vermelho text-white' :
                    'bg-white/[.06] text-pec-cinza'
                  }`}
                >
                  {t.pos}
                </span>
                <span className={t.highlight ? 'text-white' : 'text-[#d4dcef]'}>{t.nome}</span>
              </td>
              <td className={`text-center px-1 font-bebas text-[20px] ${t.highlight ? 'text-pec-vermelho' : 'text-white'}`}>{t.pts}</td>
              {[t.j, t.v, t.e, t.d, t.sg].map((v, i) => (
                <td key={i} className={`text-center px-1 text-[13px] ${t.highlight ? 'text-white' : 'text-[#d4dcef]'}`}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex gap-4 text-[10px] text-pec-cinza flex-wrap">
        <span className="flex items-center gap-1.5 before:content-[''] before:w-2 before:h-2 before:rounded-full before:bg-[#4ade80]">Zona de classificação</span>
        <span className="flex items-center gap-1.5 before:content-[''] before:w-2 before:h-2 before:rounded-full before:bg-pec-vermelho">Piauí EC</span>
      </div>
    </div>
  )
}

function MatchCard({ jogo }: { jogo: Jogo }) {
  const resultado = resultadoJogo(jogo)
  const style = RESULTADO_STYLE[resultado]
  const pecEhMandante = jogo.mandante
  const placarPec = jogo.placar_pec ?? 0
  const placarAdv = jogo.placar_adversario ?? 0
  const placarStr = resultado === 'upcoming'
    ? 'VS'
    : `${pecEhMandante ? placarPec : placarAdv} — ${pecEhMandante ? placarAdv : placarPec}`

  return (
    <div
      className={`border-l-[3px] ${style.card} border border-white/[.06] p-5 transition-all duration-300 hover:border-white/[.18] hover:-translate-y-0.5`}
      style={{ background: 'rgba(10,31,79,.3)' }}
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-[9px] tracking-[.2em] text-pec-cinza uppercase font-bold">
          {jogo.competicao}{jogo.rodada ? ` · ${jogo.rodada}` : ''}
        </span>
        <span className={`text-[9px] tracking-[.2em] font-bold uppercase px-2 py-0.5 ${style.badge}`}>
          {style.label}
        </span>
      </div>

      <div className="flex justify-between items-center mb-3.5">
        <div className="flex items-center gap-2.5 text-[13px] font-semibold text-white">
          <div className="w-6 h-7 shrink-0">
            {pecEhMandante
              ? <TeamShield url={jogo.escudo_pec_url} nome="Piauí EC" />
              : <TeamShield url={jogo.adversario_escudo_url} nome={jogo.adversario} />}
          </div>
          {pecEhMandante ? 'Piauí EC' : jogo.adversario}
        </div>
        <div className={`font-bebas text-2xl leading-none px-2 ${resultado === 'upcoming' ? 'text-[14px] font-archivo text-pec-cinza tracking-[.1em]' : 'text-white'}`}>
          {placarStr}
        </div>
        <div className="flex items-center gap-2.5 text-[13px] font-semibold text-white justify-end">
          {pecEhMandante ? jogo.adversario : 'Piauí EC'}
          <div className="w-6 h-7 shrink-0">
            {pecEhMandante
              ? <TeamShield url={jogo.adversario_escudo_url} nome={jogo.adversario} />
              : <TeamShield url={jogo.escudo_pec_url} nome="Piauí EC" />}
          </div>
        </div>
      </div>

      <div className="flex justify-between text-[11px] text-pec-cinza pt-3 border-t border-white/[.06]">
        {jogo.estadio && <span>📍 {jogo.estadio}</span>}
        {jogo.data_jogo && (
          <span>{format(new Date(jogo.data_jogo), 'dd/MM/yyyy', { locale: ptBR })}</span>
        )}
      </div>
    </div>
  )
}
