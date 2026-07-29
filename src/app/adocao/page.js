'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Adocao.module.css';

// BANCO DE DADOS ATUALIZADO COM OS 38 ANIMAIS DO CCZ
const animaisDisponiveis = [
  {
    "id": 1,
    "nome": "Amigão",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "Esse peludinho é dócil, carinhoso e amoroso — daqueles que conquista com o olhar e retribui com afeto sincero. Já está vacinado contra a raiva, vermifugado e com o controle de ectoparasitas em dia, prontinho para ser adotado com segurança e responsabilidade. Está no CCZ desde 2023, sonhando com uma família que lhe ofereça o carinho e o lar que ele tanto merece. Se você acredita no poder da adoção e quer transformar uma vida (e a sua também), venha conhecê-lo. Ele pode ser o companheiro que faltava na sua história.",
    "foto": "/img/animais/Amigao.jpeg"
  },
  {
    "id": 2,
    "nome": "Amora",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Essa SRD de porte médio tem cerca de 2 anos e é uma parceira incrível: dócil, amorosa e extremamente companheira. Já está castrada, vacinada contra a raiva, vermifugada e com a saúde em dia — pronta para começar uma nova vida ao seu lado. Está no CCZ desde 2023, aguardando por alguém que enxergue seu coração gigante e ofereça o lar que ela tanto merece. Se você procura uma amiga leal, cheia de afeto e pronta para caminhar ao seu lado, venha conhecê-la. Ela pode ser o início de uma linda história.",
    "foto": "/img/animais/Amora.jpeg"
  },
  {
    "id": 3,
    "nome": "Bela",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Bela é SRD, aproximadamente 1 ano de idade, castrada, vermifugada, controle de ectoparasitas em dia, vacinada para raiva, está no CCZ aproxidamente 3 mseses. Dócil, carinhosa, carente e brincalhona.",
    "foto": "/img/animais/Bela.jpeg"
  },
  {
    "id": 4,
    "nome": "Belisario",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "Esse peludinho já está castrado, vacinado contra a raiva, com o controle de ectoparasitas em dia e vermifugado — prontinho para fazer parte da sua família! Ele é dócil, brincalhão e tem um jeitinho especial: adora dar abraços! Está no CCZ desde 2021, esperando ansiosamente por uma chance de ser amado e viver momentos felizes ao seu lado. Se você procura um companheiro fiel e carinhoso, venha conhecê-lo. Quem sabe ele não é o amor que faltava na sua vida?",
    "foto": "/img/animais/Belisario.jpeg"
  },
  {
    "id": 5,
    "nome": "Bento",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "Esse peludinho é dócil, carinhoso, amoroso e carente — daqueles que só querem atenção, afeto e um cantinho seguro para chamar de seu. Já está vacinado contra a raiva, vermifugado e com o controle de ectoparasitas em dia, prontinho para ser acolhido com responsabilidade e muito amor. Está no CCZ desde 2025, esperando por uma família que enxergue seu jeitinho doce e ofereça o lar que ele tanto merece. Se você tem espaço no coração para um amigo fiel e carente de afeto, venha conhecê-lo. Ele pode ser o elo que faltava na sua vida.",
    "foto": "/img/animais/Bento.jpeg"
  },
  {
    "id": 6,
    "nome": "Beyonce",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Essa peludinha é castrada, vacinada contra a raiva, com controle de ectoparasitas em dia e vermifugada — prontinha para conquistar seu coração! Ela é dócil, brincalhona, carinhosa e uma verdadeira sobrevivente da cinomose, mostrando que força e ternura podem andar lado a lado. Cada abraço dela é um lembrete de que o amor supera qualquer desafio. Se você busca uma companheira leal, cheia de energia e afeto, venha conhecê-la. Ela está esperando por um lar onde possa viver cercada de carinho e segurança.",
    "foto": "/img/animais/Beyonce.jpeg"
  },
  {
    "id": 7,
    "nome": "Bibi",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Bibi é SRD mestiça com basset, aproximadamente 4 mses de idade, vacinada para raiva, controle de ectoparasitas, vermifgada, está no CCZ a mais ou menos 2 semanas. Dócil e carinhosa.",
    "foto": "/img/animais/Bibi.jpeg"
  },
  {
    "id": 8,
    "nome": "Bode",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "O Bode é um SRD de porte médio, com 4 anos, que está no CCZ desde 2025. Já está castrado, vacinado e vermifugado, pronto para ser acolhido com responsabilidade. É um cão ativo, instável e muito companheiro — precisa de um ambiente com espaço, rotina e alguém que compreenda seu perfil. Com paciência e dedicação, ele tem tudo para se tornar um parceiro fiel e cheio de personalidade. Se você tem disposição e carinho para oferecer, venha conhecer o Bode. Ele pode ser o amigo que vai transformar seus dias.",
    "foto": "/img/animais/Bode.jpeg"
  },
  {
    "id": 9,
    "nome": "Branca",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Com cerca de 5 anos, essa peludinha é dócil, amorosa e carinhosa — uma companheira pronta para retribuir cada gesto de afeto com lealdade e ternura. Está vacinada contra a raiva, vermifugada e com o controle de ectoparasitas em dia, além de ter superado a cinomose com força e coragem. Desde 2023 no CCZ, ela aguarda por alguém que lhe ofereça o lar que tanto merece. Se você acredita em recomeços e quer fazer parte da história de uma sobrevivente cheia de amor, venha conhecê-la. Ela está pronta para ser sua melhor amiga.",
    "foto": "/img/animais/Branca.jpeg"
  },
  {
    "id": 10,
    "nome": "Cardosinha",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Essa peludinha é uma verdadeira guerreira: curada da cinomose, hoje está saudável, forte e cheia de amor para dar! Ela está vacinada contra a raiva, vermifugada e com o controle de ectoparasitas em dia — prontinha para ser adotada com segurança e responsabilidade. Está no CCZ desde 2023, esperando por uma família que reconheça sua força e ofereça o carinho que ela tanto merece. Se você acredita no poder da superação e quer uma companheira leal e cheia de gratidão, venha conhecê-la. Ela pode ser o novo amor da sua vida!",
    "foto": "/img/animais/Cardosinha.jpeg"
  },
  {
    "id": 12,
    "nome": "Chicó",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "O Chicó é um SRD caramelo padrão, de porte médio, com cerca de 5 anos. Está castrado, vacinado, vermifugado e com a saúde em dia, pronto para viver uma nova fase ao lado de quem compreenda seu jeitinho. É um cão instável, que precisa de espaço e uma rotina tranquila para se sentir seguro. No CCZ desde 2025, ele aguarda por alguém que respeite seus limites e ofereça o ambiente ideal para que ele possa florescer. Se você tem um quintal, paciência e muito carinho para oferecer, o Chicó pode ser o companheiro que estava faltando na sua vida.",
    "foto": "/img/animais/Chicó.jpeg"
  },
  {
    "id": 14,
    "nome": "Cyclone",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "O Cyclone é um Pitbull de porte grande, com 4 anos, que está no CCZ desde 2025. Já está castrado, vacinado e vermifugado, com a saúde em dia e pronto para um novo começo. É um cão instável, que precisa de espaço, paciência e alguém com experiência para ajudá-lo a se sentir seguro e equilibrado. Com o ambiente certo e uma rotina estruturada, ele tem potencial para se tornar um grande companheiro. Se você tem responsabilidade, tempo e disposição para acolher um cão com perfil mais exigente, o Cyclone pode ser o desafio mais recompensador da sua vida.",
    "foto": "/img/animais/Cyclone.jpeg"
  },
  {
    "id": 15,
    "nome": "Dupeladinho",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "Esse SRD de porte médio tem 3 anos e está no CCZ desde 2022, sonhando com a chance de fazer parte de uma família. É dócil, alegre e muito companheiro — daqueles que estão sempre prontos para uma boa companhia, uma brincadeira ou um momento de carinho. Já está castrado, vacinado e vermifugado, pronto para ser acolhido com responsabilidade e afeto. Se você procura um amigo leal, divertido e cheio de amor pra dar, venha conhecer o Dupeladinho. Ele pode ser o parceiro ideal para completar sua família.",
    "foto": "/img/animais/Dupeladinho.jpeg"
  },
  {
    "id": 16,
    "nome": "Edinha",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Essa peludinha é dócil, carinhosa, amorosa e carente — daquelas que só querem um colo quentinho e alguém para chamar de família. Já está vacinada contra a raiva, vermifugada e com o controle de ectoparasitas em dia, prontinha para ser acolhida com responsabilidade e muito carinho. Está no CCZ desde 2024, esperando por uma família que enxergue seu jeitinho doce e ofereça o lar que ela tanto merece. Se você tem espaço no coração para uma amiga fiel e carente de afeto, venha conhecê-la. Ela pode ser o elo que faltava na sua vida.",
    "foto": "/img/animais/Edinha.jpeg"
  },
  {
    "id": 17,
    "nome": "Evin",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "O Evin é um SRD caramelo de porte médio, com 13 anos, que está no CCZ desde 2024. Já está castrado, vacinado e vermifugado, pronto para viver seus anos dourados com dignidade e carinho. Apesar de ser instável, quando conquista uma amizade, se revela muito amoroso e companheiro. Ele precisa de um ambiente calmo, com espaço e paciência, onde possa se sentir seguro e acolhido. Se você acredita que todo cão merece amor até o fim da vida, venha conhecer o Evin. Ele pode ser o amigo silencioso e fiel que vai tocar seu coração.",
    "foto": "/img/animais/Evin.jpeg"
  },
  {
    "id": 18,
    "nome": "Fred",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "Esse peludinho está vacinado contra a raiva, vermifugado e com o controle de ectoparasitas em dia — prontinho para ser acolhido com segurança e cuidado. Está no CCZ desde 2024, aguardando a chance de encontrar uma família que lhe ofereça amor, carinho e um lar definitivo. Cada dia que passa é uma nova esperança de ser escolhido! Se você acredita no poder da adoção responsável e quer transformar uma vida (e a sua também), venha conhecê-lo. Ele pode ser o companheiro que você estava esperando.",
    "foto": "/img/animais/Fred.jpeg"
  },
  {
    "id": 19,
    "nome": "Frederico",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "Esse peludo é vacinado contra a raiva, vermifugado e está com o controle de ectoparasitas em dia — pronto para ser acolhido com segurança e cuidado. Ele é dócil, amoroso e tem uma personalidade única, com momentos de instabilidade emocional que merecem compreensão e paciência. Está no CCZ desde 2024, aguardando uma família disposta a oferecer um lar responsável, com afeto e estabilidade. Se você acredita no poder da transformação através do amor, venha conhecê-lo. Ele pode ser o companheiro que vai te ensinar sobre empatia e retribuir com carinho verdadeiro.",
    "foto": "/img/animais/Frederico.jpeg"
  },
  {
    "id": 20,
    "nome": "Jaqueline",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Jaqueline é SRD mestiça com pitbul, porte médio, dócil, carinhosa, com bastante energia, castrada, vermifugada e vacinada, tem 3 anos e está no CCZ desde 2025",
    "foto": "/img/animais/Jaqueline.jpeg"
  },
  {
    "id": 21,
    "nome": "Kelinha",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Essa guerreirinha está vacinada contra a raiva, vermifugada e com o controle de ectoparasitas em dia — prontinha para ser acolhida com segurança e responsabilidade. Está no CCZ desde 2021, aguardando a chance de conquistar uma família que lhe ofereça amor, carinho e um lar definitivo. Cada dia é uma nova esperança de ser escolhida! Se você acredita no poder da adoção e quer transformar uma vida (e a sua também), venha conhecê-la. Ela pode ser o amor que faltava na sua casa.",
    "foto": "/img/animais/Kelinha.jpeg"
  },
  {
    "id": 22,
    "nome": "Lampiao",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "O Lampião é um SRD de porte grande, com 3 anos, que está no CCZ desde 2025 esperando por uma chance de mostrar o quanto pode ser especial. É dócil, brincalhão e tem bastante energia — ideal para quem gosta de movimento, passeios e uma companhia animada. Já está castrado, vacinado e vermifugado, prontinho para ser acolhido com responsabilidade e afeto. Se você procura um parceiro leal, divertido e cheio de vida, venha conhecer o Lampião. Ele pode ser o amigo que faltava no seu lar.",
    "foto": "/img/animais/Lampiao.jpeg"
  },
  {
    "id": 23,
    "nome": "Lola",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Essa peludinha é dócil, carinhosa, amorosa e carente — daquelas que só querem um colo quentinho e atenção sincera. Já está vacinada contra a raiva, vermifugada e com o controle de ectoparasitas em dia, prontinha para ser acolhida com responsabilidade e carinho. Está no CCZ desde 2025, sonhando com uma família que lhe ofereça o afeto e a estabilidade que ela tanto merece. Se você tem espaço no coração e na rotina para uma amiga fiel e carente de amor, venha conhecê-la. Ela pode ser o elo que faltava na sua vida.",
    "foto": "/img/animais/Lola.jpeg"
  },
  {
    "id": 24,
    "nome": "Lorena",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "A Lorena é uma pastora mestiça de porte médio, com 5 anos, que está no CCZ desde 2024. Já está castrada, vacinada e vermifugada, prontinha para começar uma nova fase cheia de amor e aventuras. Ela é dócil, brincalhona e muito ativa — perfeita para quem gosta de passeios, brincadeiras e uma companhia vibrante. Lorena tem aquele jeitinho especial que conquista com afeto e disposição.",
    "foto": "/img/animais/Lorena.jpeg"
  },
  {
    "id": 25,
    "nome": "Luna",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "A Luna é uma SRD de porte médio, com apenas 1 aninho, que já enfrentou grandes desafios. Ela superou a cinomose e, embora tenha ficado com algumas sequelas, continua sendo uma cadelinha dócil, amorosa e cheia de vontade de viver. Está castrada, vacinada e vermifugada, pronta para encontrar um lar que a acolha com carinho e responsabilidade. Desde 2024 no CCZ, ela espera por alguém que veja além das marcas da luta e reconheça a força e o amor que carrega no peito. Se você acredita que todo animal merece uma segunda chance, venha conhecer a Luna. Ela pode ser a companheira mais leal e grata que você já teve.",
    "foto": "/img/animais/Luna.jpeg"
  },
  {
    "id": 26,
    "nome": "Luna2",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Cadelinha dócil, carinhosa e cheia de amor para dar, vacinada e pronta para encontrar uma nova família.",
    "foto": "/img/animais/Luna2.jpeg"
  },
  {
    "id": 27,
    "nome": "Manqueta",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "O Manqueta é um SRD caramelo padrão, de porte médio, com cerca de 4 anos. Está no CCZ desde 2025, esperando por alguém que acompanhe seu ritmo e ofereça o lar que ele merece. É dócil, brincalhão e tem muita energia — ideal para quem gosta de movimento, passeios e momentos de diversão. Já está castrado, vacinado e vermifugado, prontinho para começar uma nova fase com saúde e segurança. Se você procura um parceiro animado, afetuoso e cheio de disposição, venha conhecer o Manqueta. Ele pode ser o seu novo melhor amigo.",
    "foto": "/img/animais/Manqueta.jpeg"
  },
  {
    "id": 29,
    "nome": "Meg",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Essa peludinha é puro afeto: dócil, carinhosa, amorosa e cheia de vontade de receber atenção — uma verdadeira companheira que vai te seguir com o olhar e o coração. Está vacinada contra a raiva, vermifugada e com o controle de ectoparasitas em dia, prontinha para começar uma nova fase da vida com saúde e segurança. Desde 2023 no CCZ, ela espera por alguém que enxergue seu valor e ofereça o lar que ela tanto merece. Cada dia é uma nova chance de ser escolhida — e talvez hoje seja o dia! Se você acredita que amor transforma, venha conhecê-la. Ela está pronta para te amar como ninguém.",
    "foto": "/img/animais/Meg.jpeg"
  },
  {
    "id": 30,
    "nome": "Mel",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "A Mel é uma SRD de porte médio, com apenas 1 aninho, que já enfrentou grandes desafios. Ela superou a cinomose e, apesar de carregar algumas sequelas, continua sendo uma cadelinha dócil, amorosa e muito esperta. Está castrada, vacinada e vermifugada, pronta para viver uma nova fase cercada de carinho e cuidado. Desde 2024 no CCZ, ela espera por alguém que enxergue além das marcas da luta e valorize sua força e doçura. Se você acredita que todo animal merece uma segunda chance, venha conhecer a Mel. Ela pode ser a companheira mais leal e grata que você já teve.",
    "foto": "/img/animais/Mel.jpeg"
  },
  {
    "id": 31,
    "nome": "Mel2",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Mel é SRD, aproximadamente 8 meses, castrada, vermifugada e com controle de ectoparasitas em dia, vacinada para raiva. Está no CCZ há mais ou menos 4 meses. Dócil.",
    "foto": "/img/animais/Mel2.jpeg"
  },
  {
    "id": 32,
    "nome": "Moana",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "A Moana é uma SRD de porte pequeno, com apenas 3 meses, e já mostra que veio ao mundo para conquistar corações. Está no CCZ desde 2025, esperando por uma família que a acolha com responsabilidade e carinho. Ela é dócil, amorosa e muito carinhosa — perfeita para quem deseja acompanhar o crescimento de uma parceira leal desde os primeiros passos. Já está vacinada e vermifugada, pronta para começar uma nova história ao seu lado. Se você sonha em ter uma companheirinha para a vida toda, venha conhecer a Moana. Ela pode ser o início de uma linda jornada.",
    "foto": "/img/animais/Moana.jpeg"
  },
  {
    "id": 34,
    "nome": "Nala",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Nala é uma American bully, de aproximadamente 6 meses de idade, vermifugada e com controle de ectoparasitas em dia. Não é castrada, vacinada para raiva. Está no CCZ há mais ou menos 2 semanas, resgatada de maus tratos.",
    "foto": "/img/animais/Nala.jpeg"
  },
  {
    "id": 35,
    "nome": "Paçoca",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "Essa peludinha já está vacinada contra a raiva, vermifugada e com o controle de ectoparasitas em dia — prontinha para ser acolhida com segurança e muito amor. Está no CCZ desde 2023, sonhando com uma família que lhe ofereça carinho, cuidado e um lar definitivo. Cada dia é uma nova esperança de ser escolhida!",
    "foto": "/img/animais/Paçoca.jpeg"
  },
  {
    "id": 36,
    "nome": "Pantera",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "A Pantera é uma SRD de porte grande, com 3 anos, que está no CCZ desde 2025. Já está castrada, vacinada e vermifugada, pronta para ser acolhida com responsabilidade. É uma cadela ativa, com muita energia e personalidade. Por ser instável, precisa de espaço e de alguém com experiência e paciência para oferecer uma rotina segura e estruturada. Com o ambiente certo, ela tem tudo para se desenvolver e se tornar uma excelente companheira. Se você tem disposição, responsabilidade e um espaço adequado, venha conhecer a Pantera. Ela pode ser a parceira que vai transformar seus dias.",
    "foto": "/img/animais/Pantera.jpeg"
  },
  {
    "id": 37,
    "nome": "Pretinha",
    "especie": "Cachorro",
    "sexo": "femea",
    "filhote": "false",
    "descricao": "Essa peludinho é pura afeto: dócil, carinhosa, brincalhona e carente daquelas que adoram companhia, carinho e uma boa brincadeira. Já está vacinada contra a raiva, vermifugada e com o controle de ectoparasitas em dia, prontinha para ser adotada com segurança e responsabilidade. Está no CCZ desde 2021, sonhando com um lar onde possa receber todo o amor que tem para oferecer. Cada dia é uma nova esperança de encontrar alguém que enxergue seu jeitinho especial. Se você busca um companheiro fiel e cheia de afeto, venha conhecê-lo. Ele pode ser o melhor amiga que você estava esperando.",
    "foto": "/img/animais/Pretinha.jpeg"
  },
  {
    "id": 38,
    "nome": "Sr vicente",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "Esse peludinho é dócil, carinhoso, amoroso e carente — daqueles que só querem um colo quentinho e alguém para chamar de família. Já está vacinado contra a raiva, vermifugado e com o controle de ectoparasitas em dia, prontinho para ser acolhido com responsabilidade e muito amor. Está no CCZ desde 2023, esperando por uma família que enxergue seu jeitinho doce e ofereça o lar que ele tanto merece. Se você tem espaço no coração para um amigo fiel e carente de afeto, venha conhecê-lo. Ele pode ser o elo que faltava na sua vida.",
    "foto": "/img/animais/Sr_vicente.jpeg"
  },
  {
    "id": 39,
    "nome": "Thiaguim",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "Esse peludo é castrado, vacinado contra a raiva, com controle de ectoparasitas em dia e vermifugado — prontinho para fazer parte da sua vida! Ele é dócil, brincalhão e carinhoso, mas tem uma exigência muito especial: não vive sem um carrinho de mão por perto! Isso mesmo — ele ama brincar com carrinhos de obra e faz deles seu companheiro inseparável. Está no CCZ desde filhote, esperando por uma família que entenda seu jeitinho único e ofereça muito amor (e um carrinho de mão, claro!). Se você tem espaço no coração e no quintal, venha conhecê-lo. Ele pode ser o parceiro que faltava na sua rotina.",
    "foto": "/img/animais/Thiaguim.jpeg"
  },
  {
    "id": 40,
    "nome": "Thor",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "Esse carinha é dócil, carinhoso, brincalhão e carente — daqueles que adoram um cafuné, uma boa brincadeira e, principalmente, companhia. Está vacinado contra a raiva, vermifugado e com o controle de ectoparasitas em dia, prontinho para começar uma nova vida com saúde e segurança. Desde 2025 no CCZ, ele sonha com um lar cheio de amor, onde possa ser acolhido como parte da família. Cada abanar de rabo é um pedido silencioso por atenção e carinho. Se você procura um amigo leal e cheio de afeto, venha conhecê-lo. Ele pode ser exatamente o que faltava no seu dia a dia.",
    "foto": "/img/animais/Thor.jpeg"
  },
  {
    "id": 41,
    "nome": "Tupam",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "Esse peludinho está vacinado contra a raiva, vermifugado e com o controle de ectoparasitas em dia — pronto para ser acolhido com responsabilidade e carinho. Ele é dócil, amoroso e tem uma personalidade instável, que pede compreensão e um ambiente tranquilo. Está no CCZ desde 2023, esperando por uma família que enxergue além das dificuldades e ofereça o cuidado que ele merece. Se você acredita no poder da adoção e tem espaço no coração para um companheiro que precisa de apoio e afeto, venha conhecê-lo. Ele pode ser a transformação que você nem sabia que precisava.",
    "foto": "/img/animais/Tupam.jpeg"
  },
  {
    "id": 43,
    "nome": "Ze",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "Esse peludinho já está castrado, vacinado contra a raiva, com controle de ectoparasitas em dia e vermifugado — ou seja, prontinho para ser adotado com segurança e responsabilidade! Ele é dócil, carinhoso e brincalhão, o tipo de companheiro que transforma qualquer dia comum em uma aventura cheia de afeto. Se você está em busca de um amigo fiel, alegre e cheio de amor para dar, venha conhecê-lo. Ele pode ser o novo integrante da sua família!",
    "foto": "/img/animais/Ze.jpeg"
  },
  {
    "id": 44,
    "nome": "Ze Grilo",
    "especie": "Cachorro",
    "sexo": "macho",
    "filhote": "false",
    "descricao": "Esse SRD caramelo padrão, de porte médio, tem 5 anos e está no CCZ desde 2025, esperando por alguém que enxergue seu coração gigante. O Zé é dócil, brincalhão e muito companheiro — adora uma boa companhia, um momento de diversão e, claro, muito carinho. Já está castrado, vacinado e vermifugado, prontinho para ser acolhido com responsabilidade e afeto. Se você procura um amigo leal, divertido e cheio de amor pra dar, venha conhecer o Zé Grilo. Ele pode ser o parceiro ideal para completar sua família.",
    "foto": "/img/animais/Ze_Grilo.jpeg"
  }
];

export default function AdocaoPage() {
  const [filtroSexo, setFiltroSexo] = useState('todos');
  const [buscaNome, setBuscaNome] = useState('');
  const [animalSelecionado, setAnimalSelecionado] = useState(null);

  // FILTRAGEM DINÂMICA
  const animaisFiltrados = animaisDisponiveis.filter(animal => {
    const bateSexo = filtroSexo === 'todos' || animal.sexo.toLowerCase() === filtroSexo;
    const bateNome = animal.nome.toLowerCase().includes(buscaNome.toLowerCase());
    return bateSexo && bateNome;
  });

  return (
    <div className={styles.pageWrapper}>
      
      {/* BARRA DE NAVEGAÇÃO SUPERIOR */}
      <div className={styles.navigationBar}>
        <div className={styles.container}>
          <Link href="/servicos/ccz" className={styles.backLink}>
            ← Voltar para o CCZ
          </Link>
        </div>
      </div>

      {/* HERO BANNER */}
      <section className={styles.heroBanner}>
        <div className={styles.container}>
          <span className={styles.heroBadge}>🐾 Posse Responsável</span>
          <h1 className={styles.heroTitle}>Adote um Amigo!</h1>
          <p className={styles.heroSubtitle}>
            Conheça os animais protegidos pelo Centro de Controle de Zoonoses Manuela Pereira da Marta. Encontre seu novo companheiro de vida!
          </p>
        </div>
      </section>

      <main className={styles.mainContainer}>
        <div className={styles.container}>

          {/* BARRA DE BUSCA E FILTROS */}
          <div className={styles.filterBarContainer}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon}>🔍</span>
              <input 
                type="text" 
                placeholder="Buscar pelo nome do animal..." 
                value={buscaNome}
                onChange={(e) => setBuscaNome(e.target.value)}
                className={styles.searchInput}
              />
              {buscaNome && (
                <button className={styles.clearBtn} onClick={() => setBuscaNome('')}>✕</button>
              )}
            </div>

            <div className={styles.filterTabs}>
              <button 
                className={`${styles.filterBtn} ${filtroSexo === 'todos' ? styles.activeFilter : ''}`}
                onClick={() => setFiltroSexo('todos')}
              >
                Todos ({animaisDisponiveis.length})
              </button>
              <button 
                className={`${styles.filterBtn} ${filtroSexo === 'macho' ? styles.activeFilter : ''}`}
                onClick={() => setFiltroSexo('macho')}
              >
                ♂️ Machos
              </button>
              <button 
                className={`${styles.filterBtn} ${filtroSexo === 'femea' ? styles.activeFilter : ''}`}
                onClick={() => setFiltroSexo('femea')}
              >
                ♀️ Fêmeas
              </button>
            </div>
          </div>

          {/* GRID DE CARDS DOS ANIMAIS */}
          {animaisFiltrados.length > 0 ? (
            <div className={styles.animaisGrid}>
              {animaisFiltrados.map((animal) => (
                <div key={animal.id} className={styles.animalCard}>
                  <div className={styles.imageWrapper}>
                    <Image 
                      src={animal.foto} 
                      alt={animal.nome}
                      width={400}
                      height={260}
                      unoptimized
                      className={styles.animalImg}
                    />
                    <span className={styles.sexoBadge}>
                      {animal.sexo.toLowerCase() === 'macho' ? '♂️ Macho' : '♀️ Fêmea'}
                    </span>
                  </div>

                  <div className={styles.cardBody}>
                    <h3 className={styles.animalNome}>{animal.nome}</h3>

                    <p className={styles.animalDesc}>
                      {animal.descricao || "Animal dócil, vacinado e pronto para encontrar um novo lar amoroso."}
                    </p>

                    <button 
                      className={styles.btnInteresse}
                      onClick={() => setAnimalSelecionado(animal)}
                    >
                      Quero Adotar o(a) {animal.nome} 💖
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span>🔍</span>
              <h3>Nenhum animal encontrado</h3>
              <p>Não encontramos nenhum amiguinho com o nome ou filtro selecionado.</p>
              <button 
                className={styles.resetBtn} 
                onClick={() => { setBuscaNome(''); setFiltroSexo('todos'); }}
              >
                Limpar Filtros
              </button>
            </div>
          )}

          {/* INFORMAÇÕES DE REQUISITOS PARA ADOÇÃO */}
          <section className={styles.requisitosBlock}>
            <h2>📋 Requisitos para Adoção Responsável</h2>
            <ul>
              <li>Ser maior de 18 anos;</li>
              <li>Apresentar documento oficial de identidade com foto (RG ou CNH) e CPF;</li>
              <li>Apresentar comprovante de residência recente;</li>
              <li>Assinar o Termo de Adoção e Responsabilidade no local da visita.</li>
            </ul>
          </section>

        </div>
      </main>

      {/* MODAL DE CONTATO DE ADOÇÃO */}
      {animalSelecionado && (
        <div className={styles.modalOverlay} onClick={() => setAnimalSelecionado(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setAnimalSelecionado(null)}>✕</button>
            
            <h2>Tenho interesse em adotar o(a) {animalSelecionado.nome}! 🐾</h2>
            <p>
              Para agendar uma visita e conhecer o(a) <strong>{animalSelecionado.nome}</strong> no Centro de Controle de Zoonoses Manuela Pereira da Marta, escolha uma das formas de contato abaixo:
            </p>

            <div className={styles.modalContacts}>
              <a 
                href={`https://api.whatsapp.com/send?phone=5532988544126&text=Olá!+Vi+o(a)+${encodeURIComponent(animalSelecionado.nome)}+no+portal+e+gostaria+de+agendar+uma+visita+para+adoção!`} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.btnWhatsapp}
              >
                💬 Falar pelo WhatsApp do CCZ
              </a>

              <a href="tel:3220208123" className={styles.btnTelefone}>
                📞 Ligar para (32) 2020-8123
              </a>
            </div>

            <p className={styles.modalEndereco}>
              📍 <strong>Atendimento Presencial:</strong> BR-356, sentido Muriaé–Ervália (Horário: Segunda a Sexta, das 07h às 16h).
            </p>
          </div>
        </div>
      )}

    </div>
  );
}