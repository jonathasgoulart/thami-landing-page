"use client";

import { useState, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  avatarUrl?: string;
}

export default function FanpageView({ data }: { data: any }) {
  const [activeTab, setActiveTab] = useState('perfil');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Form state for login
  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');

  // Likes state: record post_id -> { liked: boolean, count: number }
  const [likes, setLikes] = useState<Record<string, { liked: boolean; count: number }>>({
    post_1: { liked: false, count: 12 },
    post_2: { liked: false, count: 5 },
  });

  useEffect(() => {
    // Load saved user from localStorage
    try {
      const savedUser = localStorage.getItem('fanpage_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      const savedLikes = localStorage.getItem('fanpage_likes');
      if (savedLikes) {
        setLikes(JSON.parse(savedLikes));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName || !inputEmail) return;

    const newUser: User = {
      name: inputName,
      email: inputEmail,
      avatarUrl: user?.avatarUrl || '',
    };
    setUser(newUser);
    localStorage.setItem('fanpage_user', JSON.stringify(newUser));
    setIsLoginModalOpen(false);
  };

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const updatedUser: User = {
        name: user?.name || inputName || 'Usuário',
        email: user?.email || inputEmail || '',
        avatarUrl: dataUrl,
      };
      setUser(updatedUser);
      localStorage.setItem('fanpage_user', JSON.stringify(updatedUser));
    };
    reader.readAsDataURL(file);
  };

  const toggleLike = (postId: string) => {
    setLikes((prev) => {
      const current = prev[postId] || { liked: false, count: 0 };
      const nextLiked = !current.liked;
      const nextCount = nextLiked ? current.count + 1 : Math.max(0, current.count - 1);
      const updated = {
        ...prev,
        [postId]: { liked: nextLiked, count: nextCount },
      };
      localStorage.setItem('fanpage_likes', JSON.stringify(updated));
      return updated;
    });
  };

  // Helper component for displaying user initial when photo is missing
  const AvatarDisplay = ({
    name,
    avatarUrl,
    sizeClasses = 'w-10 h-10 text-base',
  }: {
    name: string;
    avatarUrl?: string;
    sizeClasses?: string;
  }) => {
    const initial = (name || 'U').charAt(0).toUpperCase();

    if (avatarUrl) {
      return (
        <img
          src={avatarUrl}
          alt={name}
          className={`${sizeClasses} rounded-full object-cover shrink-0`}
        />
      );
    }

    return (
      <div
        className={`${sizeClasses} rounded-full bg-gradient-to-tr from-purple-700 to-indigo-500 text-white font-bold flex items-center justify-center shrink-0 shadow-inner border border-white/20 select-none`}
      >
        {initial}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans pb-16 absolute inset-0 z-50 overflow-y-auto">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#111111] border-b border-[#222222]">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold tracking-tight">fanfirst</div>
          <div className="flex gap-4 items-center">
            {user ? (
              <div className="flex items-center gap-3 bg-[#1c1c1c] px-3 py-1.5 rounded-full border border-white/10">
                <AvatarDisplay name={user.name} avatarUrl={user.avatarUrl} sizeClasses="w-8 h-8 text-sm" />
                <span className="text-sm font-medium text-gray-200">{user.name}</span>
                <button
                  onClick={() => {
                    setUser(null);
                    localStorage.removeItem('fanpage_user');
                  }}
                  className="text-xs text-gray-400 hover:text-red-400 ml-1 transition-colors"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full font-medium transition-colors text-sm"
              >
                Entrar / Cadastrar
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Cover Area */}
      <div className="relative w-full">
        <div className="h-[250px] w-full bg-gradient-to-r from-purple-900 to-blue-600"></div>
        <div className="max-w-6xl mx-auto px-4 relative flex items-end -mt-[60px] gap-6 mb-8 flex-col md:flex-row md:items-end text-center md:text-left">
          
          {/* Artist / User Avatar with Direct Click Upload */}
          <div className="relative group mx-auto md:mx-0">
            <div className="w-[120px] h-[120px] rounded-full border-4 border-[#0a0a0a] bg-gray-800 overflow-hidden shrink-0">
              <AvatarDisplay name={data.name || "THAMI"} avatarUrl={data.avatarUrl || "https://ui-avatars.com/api/?name=Thami&background=333&color=fff&size=120"} sizeClasses="w-full h-full text-4xl" />
            </div>

            {/* Direct visible photo change button (no hover text required) */}
            <label
              htmlFor="user-avatar-upload"
              className="absolute bottom-1 right-1 bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-full cursor-pointer shadow-lg border border-white/20 transition-all"
              title="Trocar Foto"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm9-4h-3.17l-1.86-2H7.99L6.17 5H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 14c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
              </svg>
              <input
                id="user-avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePhotoUpload}
              />
            </label>
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
                </div>

                {/* Normal Post 1 */}
                <div className="bg-[#151515] rounded-xl p-6 border border-[#222222]">
                  <div className="flex items-center gap-4 mb-4">
                    <AvatarDisplay name={data.name || "THAMI"} avatarUrl={data.avatarUrl} sizeClasses="w-10 h-10 text-base" />
                    <div className="flex flex-col">
                      <span className="font-semibold flex items-center gap-1">{data.name || "THAMI"} <span className="text-blue-500 text-xs">✓</span></span>
                      <span className="text-xs text-gray-400">há 2 horas</span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <p className="text-gray-200">Ouça o novo single "Fiquei Assim" em todas as plataformas de áudio! 🎶</p>
                  </div>
                  <div className="flex gap-6 text-gray-400 border-t border-[#222222] pt-4">
                    <button
                      onClick={() => toggleLike('post_1')}
                      className={`flex items-center gap-2 transition-colors ${likes.post_1?.liked ? 'text-red-500 font-semibold' : 'hover:text-white'}`}
                    >
                      <span className="text-xl">{likes.post_1?.liked ? '❤️' : '🤍'}</span> {likes.post_1?.count || 12}
                    </button>
                  </div>
                </div>

                {/* Normal Post 2 */}
                <div className="bg-[#151515] rounded-xl p-6 border border-[#222222]">
                  <div className="flex items-center gap-4 mb-4">
                    <AvatarDisplay name={data.name || "THAMI"} avatarUrl={data.avatarUrl} sizeClasses="w-10 h-10 text-base" />
                    <div className="flex flex-col">
                      <span className="font-semibold flex items-center gap-1">{data.name || "THAMI"} <span className="text-blue-500 text-xs">✓</span></span>
                      <span className="text-xs text-gray-400">há 48 minutos</span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <p className="text-gray-200">Bem-vindos à minha página oficial! Muito feliz em ter vocês aqui.</p>
                  </div>
                  <div className="flex gap-6 text-gray-400 border-t border-[#222222] pt-4">
                    <button
                      onClick={() => toggleLike('post_2')}
                      className={`flex items-center gap-2 transition-colors ${likes.post_2?.liked ? 'text-red-500 font-semibold' : 'hover:text-white'}`}
                    >
                      <span className="text-xl">{likes.post_2?.liked ? '❤️' : '🤍'}</span> {likes.post_2?.count || 5}
                    </button>
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
              <div className="w-20 h-20 mx-auto mb-4">
                <AvatarDisplay name={data.name || "THAMI"} avatarUrl={data.avatarUrl} sizeClasses="w-20 h-20 text-2xl" />
              </div>
              <h3 className="text-xl font-bold flex items-center justify-center gap-1">{data.name || "THAMI"} <span className="text-blue-500 text-sm">✓</span></h3>
              <p className="text-gray-400 text-sm mb-4">@thami</p>
              <p className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
                {data.bio || "Obrigado por se juntar à minha página Fanfirst!\nAqui é onde compartilharei conteúdos e atualizações especiais apenas para você! 💖"}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#222222] mt-16 py-8">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4 text-gray-400 text-sm">
          <div><span className="font-bold text-white">fanfirst</span> © 2026 Fanfirst. Todos os direitos reservados.</div>
        </div>
      </footer>

      {/* Login Modal with Name + Email */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000]" onClick={() => setIsLoginModalOpen(false)}>
          <div className="bg-[#151515] p-8 rounded-xl w-full max-w-md relative border border-[#222222]" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl" onClick={() => setIsLoginModalOpen(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-6 text-center">Entrar na sua conta</h2>
            <form className="space-y-4" onSubmit={handleLoginSubmit}>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Nome</label>
                <input
                  type="text"
                  placeholder="Seu nome completo"
                  value={inputName}
                  onChange={e => setInputName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#0a0a0a] border border-[#222222] text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Seu email"
                  value={inputEmail}
                  onChange={e => setInputEmail(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#0a0a0a] border border-[#222222] text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Senha</label>
                <input
                  type="password"
                  placeholder="Sua senha"
                  value={inputPassword}
                  onChange={e => setInputPassword(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#0a0a0a] border border-[#222222] text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg font-medium transition-colors mt-4">
                Entrar / Cadastrar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
