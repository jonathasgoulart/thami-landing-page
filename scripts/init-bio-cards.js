// Script para adicionar bioCards ao conteúdo existente no Supabase
// Execute: node scripts/init-bio-cards.js

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const defaultBioCards = [
    {
        id: 'bio-01',
        label: 'QUEM SOU',
        title: 'Sobre THAMI',
        text: 'Sou uma cantora e compositora brasileira transformando minhas vivências em música. Criada na Baixada Fluminense (RJ) e atualmente morando em São Paulo, trago em meu som elementos do afrobeat, R&B, música brasileira contemporânea e pop — com beats envolventes, letras poéticas e arranjos originais que transmitem minha força e sensibilidade.\n\nMinha trajetória é marcada pela minha pluralidade: da música ao teatro musical, da dança à composição. Alicia Keys, Erykah Badu, Djavan e Luedij Luna são referências que moldam minha identidade musical.',
        imageUrl: '',
    },
    {
        id: 'bio-02',
        label: 'TRAJETÓRIA',
        title: 'Trabalho e Carreira',
        text: 'Comecei minha carreira com participações que marcaram minha formação — como no coral da IZA e como backing vocal no Rock in Rio 2019. Após lançar meu primeiro EP, NUA, e acumular mais de 3 milhões de plays nas plataformas digitais, me mudei para São Paulo em busca de novos horizontes musicais.\n\nEssa mudança resultou no álbum Labirinto, lançado em 2024, que carrega R&B, Soul, Pop, Afrobeat e Samba. Agora em 2026, lanço "Relevuras" — a jornada de uma mulher que luta contra o tempo e não desiste.',
        imageUrl: '',
    },
    {
        id: 'bio-03',
        label: 'AO VIVO',
        title: 'Palco e Presença',
        text: 'A performance ao vivo é onde tudo se transforma. Já me apresentei em alguns dos palcos mais importantes do Brasil:\n\n• Teatro SESI RJ\n• Teatro Rival RJ\n• Sesc Bauru SP\n• Blue Note SP\n\nCada show é uma experiência única — onde a voz, o corpo e a emoção se encontram para criar algo que só acontece naquele momento.',
        imageUrl: '',
    },
    {
        id: 'bio-04',
        label: 'IMPRENSA',
        title: 'Na Mídia',
        text: 'Minha música e minha trajetória têm ganhado reconhecimento na imprensa especializada e nos principais veículos culturais do Brasil.\n\nDestaques em G1, Revista Raça, Blog do Mauro Ferreira e outros veículos que acompanham a nova geração da música brasileira.',
        imageUrl: '',
    },
    {
        id: 'bio-05',
        label: 'CONQUISTAS',
        title: 'Marcos e Reconhecimentos',
        text: 'Uma trajetória construída com consistência e propósito:\n\n• Som Livre\n• SIM SP\n• WME (William Morris Endeavor)\n• Prêmio Baixada In Cena 2025\n\nCada conquista representa o compromisso com uma arte verdadeira e com o impacto que a música pode ter na vida das pessoas.',
        imageUrl: '',
    },
];

async function main() {
    console.log('🔄 Buscando conteúdo atual do Supabase...');

    const { data, error } = await supabase
        .from('site_content')
        .select('data')
        .eq('id', 1)
        .single();

    if (error || !data) {
        console.error('❌ Erro ao buscar conteúdo:', error);
        process.exit(1);
    }

    const currentContent = data.data;

    if (currentContent.bioCards && currentContent.bioCards.length > 0) {
        console.log('⚠️  bioCards já existe no banco com', currentContent.bioCards.length, 'cards. Pulando...');
        console.log('   Para forçar, remova o campo bioCards do banco primeiro.');
        process.exit(0);
    }

    console.log('✅ Adicionando bioCards...');

    const newContent = {
        ...currentContent,
        bioCards: defaultBioCards,
    };

    const { error: updateError } = await supabase
        .from('site_content')
        .upsert({ id: 1, data: newContent });

    if (updateError) {
        console.error('❌ Erro ao atualizar:', updateError);
        process.exit(1);
    }

    console.log('🎉 bioCards adicionados com sucesso ao Supabase!');
    console.log('   Agora acesse /admin/dashboard/bio para adicionar as fotos de cada card.');
}

main();
