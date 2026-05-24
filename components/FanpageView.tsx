"use client";

import { useState } from 'react';

export default function FanpageView({ data }: { data: any }) {
  const [activeTab, setActiveTab] = useState('perfil');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-16 absolute inset-0 z-50 overflow-y-auto">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#111111] border-b border-[#222222]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold tracking-tight">fanfirst</div>
          <div className="flex gap-4 items-center">
            <button className="text-gray-400 hover:text-white transition-colors text-sm">Criar Conta</button>
            <button 
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full font-medium transition-colors"
            >
              Entrar
            </button>
          </div>
        </div>
      </nav>

      {/* Cover Area */}
      <div className="relative w-full">
        <div className="h-[250px] w-full bg-gradient-to-r from-purple-900 to-blue-600"></div>
        <div className="max-w-6xl mx-auto px-4 relative flex items-end -mt-[60px] gap-6 mb-8 flex-col md:flex-row md:items-end text-center md:text-left">
          <div className="w-[120px] h-[120px] rounded-full border-4 border-[#0a0a0a] bg-gray-800 overflow-hidden shrink-0 mx-auto md:mx-0">
            <img src="https://ui-avatars.com/api/?name=Thami&background=333&color=fff&size=120" alt="THAMI" className="w-full h-full object-cover" />
          </div>
          <div className="mb-4">
            <h1 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-2">
              {data.name || "THAMI"} <span className="text-blue-500 text-lg">✓</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4">
        {/* Tabs */}
        <div className="flex flex-col md:flex-row bg-[#151515] rounded-xl p-2 mb-8 gap-2">
          {['perfil', 'comunidade', 'musica'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 p-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 capitalize ${activeTab === tab ? 'bg-[#1a1a1a] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feed Column */}
          <div className="md:col-span-2">
            
            {activeTab === 'comunidade' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Comunidade</h2>
                  <a href="#" className="text-gray-400 text-sm hover:text-white">Ver Mais &rarr;</a>
                </div>

                {/* Exclusive Post */}
                <div className="bg-[#151515] rounded-xl p-6 border border-[#222222]">
                  <div className="flex items-center gap-4 mb-4">
                    <img src="https://ui-avatars.com/api/?name=Thami&background=333&color=fff" alt="THAMI" className="w-10 h-10 rounded-full" />
                    <div className="flex flex-col">
                      <span className="font-semibold flex items-center gap-1">{data.name || "THAMI"} <span className="text-blue-500 text-xs">✓</span></span>
                      <span className="text-xs text-gray-400">há 2 horas</span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <p className="mb-4 text-gray-200">{data.exclusiveText || "Música nova saindo do forno! 🎧 Quem quiser ouvir a guia acústica de \"Fiquei Assim\" antes do lançamento oficial, é só desbloquear abaixo 👇"}</p>
                    
                    <div 
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="relative rounded-xl overflow-hidden cursor-pointer mt-4 h-[250px] bg-black group"
                    >
                      <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover blur-sm brightness-50 group-hover:blur-md transition-all" alt="Exclusive" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 gap-2">
                        <div className="text-5xl text-white">🔒</div>
                        <span className="text-xl font-semibold text-white">Desbloquear Áudio</span>
                      </div>
                    </div>

                  </div>
                  <div className="flex gap-6 text-gray-400 border-t border-[#222222] pt-4">
                    <button className="flex items-center gap-2 hover:text-white transition-colors"><span className="text-xl">🤍</span> 12</button>
                    <button className="flex items-center gap-2 hover:text-white transition-colors"><span className="text-xl">💬</span> 3</button>
                  </div>
                </div>

                {/* Normal Post */}
                <div className="bg-[#151515] rounded-xl p-6 border border-[#222222]">
                  <div className="flex items-center gap-4 mb-4">
                    <img src="https://ui-avatars.com/api/?name=Thami&background=333&color=fff" alt="THAMI" className="w-10 h-10 rounded-full" />
                    <div className="flex flex-col">
                      <span className="font-semibold flex items-center gap-1">{data.name || "THAMI"} <span className="text-blue-500 text-xs">✓</span></span>
                      <span className="text-xs text-gray-400">há 48 minutos</span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <p className="text-gray-200">Bem-vindos à minha página oficial! Muito feliz em ter vocês aqui.</p>
                  </div>
                  <div className="flex gap-6 text-gray-400 border-t border-[#222222] pt-4">
                    <button className="flex items-center gap-2 hover:text-white transition-colors"><span className="text-xl">🤍</span> 0</button>
                    <button className="flex items-center gap-2 hover:text-white transition-colors"><span className="text-xl">💬</span> 0</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'musica' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Música</h2>
                <div className="bg-[#151515] rounded-xl p-12 text-center border border-[#222222]">
                  <div className="text-5xl text-gray-400 mb-4">🎵</div>
                  <p className="mb-6 text-gray-300">Ouça os últimos lançamentos de {data.name || "THAMI"}.</p>
                  <iframe 
                    style={{borderRadius: '12px', marginTop: '1.5rem'}} 
                    src={data.spotifyUrl || "https://open.spotify.com/embed/artist/6fupiyOvfbI12eijANkwZL?utm_source=generator"}
                    width="100%" 
                    height="352" 
                    frameBorder="0" 
                    allowFullScreen={true} 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy">
                  </iframe>
                </div>
              </div>
            )}

            {activeTab === 'perfil' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Perfil</h2>
                <div className="bg-[#151515] rounded-xl p-6 border border-[#222222]">
                  <h3 className="text-lg font-bold">Sobre {data.name || "THAMI"}</h3>
                  <p className="mt-4 text-gray-400 leading-relaxed whitespace-pre-wrap">
                    {data.bio || "Sou uma cantora e compositora brasileira transformando minhas vivências em música..."}
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Right Column (Sidebar) */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-[#151515] rounded-xl p-6 text-center border border-[#222222]">
              <img src="https://ui-avatars.com/api/?name=Thami&background=333&color=fff" alt="THAMI" className="w-20 h-20 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-bold flex items-center justify-center gap-1">{data.name || "THAMI"} <span className="text-blue-500 text-sm">✓</span></h3>
              <p className="text-gray-400 text-sm mb-4">@thami</p>
              <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
                {data.bio || "Obrigado por se juntar à minha página Fanfirst!\nAqui é onde compartilharei conteúdo exclusivo, trabalhos em andamento e atualizações especiais apenas para você! 💖"}
              </p>
            </div>

            <div className="bg-[#151515] rounded-xl p-6 border border-[#222222]">
              <h3 className="text-lg font-bold border-b border-[#222222] pb-2 mb-4">Principais Apoiadores</h3>
              <div className="text-center text-gray-400 text-sm py-4">
                Ainda não há apoiadores.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#222222] mt-16 py-8">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4 text-gray-400 text-sm">
          <div><span className="font-bold text-white">fanfirst</span> © 2026 Fanfirst. Todos os direitos reservados.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Sobre</a>
            <a href="#" className="hover:text-white">Privacidade</a>
            <a href="#" className="hover:text-white">Termos</a>
            <a href="#" className="hover:text-white">Contato</a>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000]" onClick={() => setIsLoginModalOpen(false)}>
          <div className="bg-[#151515] p-8 rounded-xl w-full max-w-md relative border border-[#222222]" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl" onClick={() => setIsLoginModalOpen(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-6 text-center">Entrar na sua conta</h2>
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Email</label>
                <input type="email" placeholder="Seu email" className="w-full p-3 rounded-lg bg-[#0a0a0a] border border-[#222222] text-white focus:outline-none focus:border-purple-500" required />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Senha</label>
                <input type="password" placeholder="Sua senha" className="w-full p-3 rounded-lg bg-[#0a0a0a] border border-[#222222] text-white focus:outline-none focus:border-purple-500" required />
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg font-medium transition-colors mt-4">Entrar</button>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000]" onClick={() => setIsPaymentModalOpen(false)}>
          <div className="bg-[#151515] p-8 rounded-xl w-full max-w-md relative border border-[#222222] text-center" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl" onClick={() => setIsPaymentModalOpen(false)}>&times;</button>
            <div className="text-5xl text-purple-500 mb-4">🔒</div>
            <h2 className="text-2xl font-bold mb-2">Conteúdo Exclusivo</h2>
            <p className="text-gray-400 mb-6">Desbloqueie essa música antes do lançamento oficial!</p>
            <div className="text-3xl font-bold mb-6">{data.exclusivePrice || "R$ 15,00"}</div>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg font-medium transition-colors flex justify-center items-center gap-2">
               🛒 Comprar Acesso
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
