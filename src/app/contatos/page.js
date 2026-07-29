'use client';

import { useState } from 'react';
import styles from './Contatos.module.css';

// BANCO DE DADOS COMPLETO E ATUALIZADO DE CONTATOS DA SAÚDE DE MURIAÉ
const listaContatos = [
  {
    id: 1,
    nome: "UBS AEROPORTO",
    telefone: "(32) 2020-8060",
    endereco: "Rua Antônio Ramos, s/n",
    email: "ubsaeroporto2018@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Aeroporto+Rua+Antonio+Ramos+Muriae+MG"
  },
  {
    id: 2,
    nome: "POLICLÍNICA CENTRAL",
    telefone: "(32) 2020-8000",
    endereco: "Av. Principal, 123",
    email: "policlinica@muriaesaude.com",
    categoria: "Policlínica",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Policlinica+Central+Muriae+MG"
  },
  {
    id: 3,
    nome: "UBS BARRA I",
    telefone: "(32) 2020-8088",
    endereco: "Rua Rui Barbosa, 145",
    email: "ubsbarra1muriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Barra+1+Rua+Rui+Barbosa+145+Muriae+MG"
  },
  {
    id: 4,
    nome: "UBS BARRA II",
    telefone: "(32) 2020-8067",
    endereco: "Rua Souza Castro, 73",
    email: "ubsbarra2muriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Barra+2+Rua+Souza+Castro+73+Muriae+MG"
  },
  {
    id: 5,
    nome: "UBS BELISÁRIO",
    telefone: "(32) 2020-8098",
    endereco: "Rua Dona França Machado, s/n",
    email: "ubsbelisariomuriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Belisario+Muriae+MG"
  },
  {
    id: 6,
    nome: "SÃO DOMINGOS",
    telefone: "(32) 2020-8098",
    endereco: "Rua Principal, s/n",
    email: "ubsbelisariomuriae@gmail.com",
    categoria: "Ponto de Apoio",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sao+Domingos+Belisario+Muriae+MG"
  },
  {
    id: 7,
    nome: "SANTA LÚCIA",
    telefone: "(32) 2020-8098",
    endereco: "Comunidade Santa Lucia",
    email: "ubsbelisariomuriae@gmail.com",
    categoria: "Ponto de Apoio",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Comunidade+Santa+Lucia+Muriae+MG"
  },
  {
    id: 8,
    nome: "UBS BOA FAMÍLIA",
    telefone: "(32) 2020-8057",
    endereco: "Rua Nova, s/n",
    email: "ubsboafamiliamuriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Boa+Familia+Muriae+MG"
  },
  {
    id: 9,
    nome: "MACUCO",
    telefone: "(32) 2020-8100",
    endereco: "Avenida Rute do Carmo, 306",
    email: "ubsboafamiliamuriae@gmail.com",
    categoria: "Ponto de Apoio",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Macuco+Avenida+Rute+do+Carmo+306+Muriae+MG"
  },
  {
    id: 10,
    nome: "SÃO FERNANDO",
    telefone: "(32) 2020-8057",
    endereco: "Comunidade São Fernando",
    email: "ubsboafamiliamuriae@gmail.com",
    categoria: "Ponto de Apoio",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Comunidade+Sao+Fernando+Muriae+MG"
  },
  {
    id: 11,
    nome: "UBS BOM JESUS",
    telefone: "(32) 2020-8102",
    endereco: "Rua Antônio Teodoro Ribeiro, s/n",
    email: "ubsbomjesusmuriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Bom+Jesus+Muriae+MG"
  },
  {
    id: 12,
    nome: "UBS CARDOSO DE MELO",
    telefone: "(32) 2020-8064",
    endereco: "Rua Jair Cardoso de Melo, s/n",
    email: "ubscardosodemelomuriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Cardoso+de+Melo+Muriae+MG"
  },
  {
    id: 13,
    nome: "UBS CERÂMICA",
    telefone: "(32) 2020-8072",
    endereco: "Rua Silvério Campos, s/n",
    email: "ubsceramicamuriae2018@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Ceramica+Muriae+MG"
  },
  {
    id: 14,
    nome: "UBS DORNELAS",
    telefone: "(32) 2020-8094",
    endereco: "Rua Doutor Wilson Alvim do Amaral, 69",
    email: "ubsdornelasmuriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Dornelas+Muriae+MG"
  },
  {
    id: 15,
    nome: "UBS DORNELAS II",
    telefone: "(32) 2020-8094",
    endereco: "Rua Nílton Henrique de Almeida, 175",
    email: "dornelas2ubsmuriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Dornelas+2+Muriae+MG"
  },
  {
    id: 16,
    nome: "UBS FRANCO SUÍÇO",
    telefone: "(32) 2020-8077",
    endereco: "Rua Augusta da Silva, 171",
    email: "ubsjosecirilomuriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Franco+Suico+Muriae+MG"
  },
  {
    id: 17,
    nome: "UBS GASPAR",
    telefone: "(32) 2020-8068",
    endereco: "Rua Maria Xavier Santana, s/n",
    email: "ubsgasparmuriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Gaspar+Muriae+MG"
  },
  {
    id: 18,
    nome: "UBS INCONFIDÊNCIA",
    telefone: "(32) 2020-8073",
    endereco: "Rua Claudio Manoel Costa, s/n",
    email: "ubsinconfidencia2018@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Inconfidencia+Muriae+MG"
  },
  {
    id: 19,
    nome: "UBS ITAMURI",
    telefone: "(32) 2020-8101",
    endereco: "Rua Largo da Matriz, s/n",
    email: "ubsitamurimuriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Itamuri+Muriae+MG"
  },
  {
    id: 20,
    nome: "SOFOCO",
    telefone: "(32) 2020-8101",
    endereco: "Rua Alvino Carlos de Souza, 97",
    email: "ubsitamurimuriae@gmail.com",
    categoria: "Ponto de Apoio",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sofoco+Itamuri+Muriae+MG"
  },
  {
    id: 21,
    nome: "PATRIMÔNIO DOS CARNEIROS",
    telefone: "(32) 2020-8101",
    endereco: "Comunidade Patrimônio dos Carneiros",
    email: "ubsitamurimuriae@gmail.com",
    categoria: "Ponto de Apoio",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Patrimonio+dos+Carneiros+Muriae+MG"
  },
  {
    id: 22,
    nome: "CAPETINGA",
    telefone: "(32) 2020-8101",
    endereco: "Rua Principal, s/n - Capetinga",
    email: "ubsitamurimuriae@gmail.com",
    categoria: "Ponto de Apoio",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Capetinga+Itamuri+Muriae+MG"
  },
  {
    id: 23,
    nome: "BOM JARDIM",
    telefone: "(32) 2020-8101",
    endereco: "Distrito de Bom Jardim",
    email: "ubsitamurimuriae@gmail.com",
    categoria: "Ponto de Apoio",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bom+Jardim+Muriae+MG"
  },
  {
    id: 24,
    nome: "UBS JOÃO XXIII",
    telefone: "(32) 2020-8133",
    endereco: "Rua Judith Pompei, 996",
    email: "joao23ubsmuriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Joao+XXIII+Muriae+MG"
  },
  {
    id: 25,
    nome: "UBS JOANÓPOLIS",
    telefone: "(32) 2020-8084",
    endereco: "Rua Antônio Tureta, s/n",
    email: "ubsjoanopolismuriae2018@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Joanopolis+Muriae+MG"
  },
  {
    id: 26,
    nome: "SÃO JOAQUIM",
    telefone: "(32) 2020-8084",
    endereco: "Rua da Fazenda, 141",
    email: "ubsjoanopolismuriae2018@gmail.com",
    categoria: "Ponto de Apoio",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sao+Joaquim+Muriae+MG"
  },
  {
    id: 27,
    nome: "UBS MARAMBAIA",
    telefone: "(32) 2020-8083",
    endereco: "Rua Espírito Santo, s/n",
    email: "ubsmarambaiamuriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Marambaia+Muriae+MG"
  },
  {
    id: 28,
    nome: "SÃO FRANCISCO DO GLÓRIA",
    telefone: "(32) 2020-8083",
    endereco: "Comunidade São Francisco do Glória",
    email: "ubsmarambaiamuriae@gmail.com",
    categoria: "Ponto de Apoio",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Sao+Francisco+do+Gloria+Muriae+MG"
  },
  {
    id: 29,
    nome: "UBS PATRIMÔNIO SÃO JOSÉ",
    telefone: "(32) 2020-8085",
    endereco: "Rua Pedro Muglia, s/n",
    email: "ubspatsaojosemuriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Patrimonio+Sao+Jose+Muriae+MG"
  },
  {
    id: 30,
    nome: "UBS PLANALTO",
    telefone: "(32) 2020-8089",
    endereco: "Rua Leon Dala Paula, s/n",
    email: "ubsplanaltomuriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Planalto+Muriae+MG"
  },
  {
    id: 31,
    nome: "UBS PORTO",
    telefone: "(32) 2020-8078",
    endereco: "Rua Coronel Pereira Sobrinho, s/n",
    email: "ubsportomuriae2018@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Porto+Muriae+MG"
  },
  {
    id: 32,
    nome: "UBS PRIMAVERA",
    telefone: "(32) 2020-8097",
    endereco: "Rua Alameda dos Oiti, s/n",
    email: "ubsprimaveramuriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Primavera+Muriae+MG"
  },
  {
    id: 33,
    nome: "UBS RECANTO VERDE",
    telefone: "(32) 2020-8061",
    endereco: "Rua dos Coqueiros, s/n",
    email: "ubsrecantoverdemuriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Recanto+Verde+Muriae+MG"
  },
  {
    id: 34,
    nome: "UBS SAFIRA",
    telefone: "(32) 2020-8076",
    endereco: "Rua Silvério Campos, s/n",
    email: "ubssafiramuriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Safira+Muriae+MG"
  },
  {
    id: 35,
    nome: "UBS SANTANA",
    telefone: "(32) 2020-8071",
    endereco: "Avenida Maria Cândida do Carmo, s/n",
    email: "ubssantana2017@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Santana+Muriae+MG"
  },
  {
    id: 36,
    nome: "UBS SANTO ANTÔNIO",
    telefone: "(32) 2020-8086",
    endereco: "Rua Santo Antônio, s/n",
    email: "ubssantoantoniomuriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Santo+Antonio+Muriae+MG"
  },
  {
    id: 37,
    nome: "UBS SÃO CRISTÓVÃO",
    telefone: "(32) 2020-8072",
    endereco: "Rua Itália, s/n",
    email: "ubssaocristovaomuriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Sao+Cristovao+Muriae+MG"
  },
  {
    id: 38,
    nome: "UBS SÃO FRANCISCO I",
    telefone: "(32) 2020-8081",
    endereco: "Avenida Cel. Francisco Gomes Campos, s/n",
    email: "ubssaofrancisco1muriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Sao+Francisco+1+Muriae+MG"
  },
  {
    id: 39,
    nome: "UBS SÃO FRANCISCO II",
    telefone: "(32) 2020-8081",
    endereco: "Avenida Cel. Francisco Gomes Campos, s/n",
    email: "ubssaofrancisco2muriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Sao+Francisco+2+Muriae+MG"
  },
  {
    id: 40,
    nome: "UBS SÃO FRANCISCO III",
    telefone: "(32) 2020-8081",
    endereco: "Avenida Cel. Francisco Gomes Campos, s/n",
    email: "ubssaofrancisco3muriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Sao+Francisco+3+Muriae+MG"
  },
  {
    id: 41,
    nome: "UBS SÃO GOTARDO",
    telefone: "(32) 2020-8093",
    endereco: "Avenida Vicente Alves, 617",
    email: "ubssaogotardomuriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Sao+Gotardo+Muriae+MG"
  },
  {
    id: 42,
    nome: "UBS SÃO PEDRO",
    telefone: "(32) 2020-8069",
    endereco: "Praça da Liberdade, 428",
    email: "ubssaopedromuriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Sao+Pedro+Muriae+MG"
  },
  {
    id: 43,
    nome: "UBS SANTA TEREZINHA I",
    telefone: "(32) 2020-8075",
    endereco: "Rua Visconde do Rio Branco, s/n",
    email: "ubssantaterezinha1muriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Santa+Terezinha+1+Muriae+MG"
  },
  {
    id: 44,
    nome: "UBS SANTA TEREZINHA II",
    telefone: "(32) 2020-8075",
    endereco: "Rua Visconde do Rio Branco, s/n",
    email: "ubssantaterezinha2muriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Santa+Terezinha+2+Muriae+MG"
  },
  {
    id: 45,
    nome: "UBS VERMELHO",
    telefone: "(32) 2020-8099",
    endereco: "Rua Alberto Siqueira, s/n",
    email: "ubsvermelhomuriae@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Vermelho+Muriae+MG"
  },
  {
    id: 46,
    nome: "UBS VERMELHO II",
    telefone: "(32) 2020-8121",
    endereco: "Rua Francisco Pinto, s/n",
    email: "ubsvermelhomuriae2@gmail.com",
    categoria: "UBS",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UBS+Vermelho+2+Muriae+MG"
  },
  {
    id: 47,
    nome: "PIRAPANEMA",
    telefone: "(32) 2020-8103",
    endereco: "Rua Vereador Jacy Vargas, s/n",
    email: "ubsvermelhomuriae2@gmail.com",
    categoria: "Ponto de Apoio",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Pirapanema+Muriae+MG"
  },
  {
    id: 48,
    nome: "POLICLÍNICA CAIC",
    telefone: "(32) 2020-8080",
    endereco: "R. Antônio Pereira Galvão, 555 - Encoberta",
    email: "",
    categoria: "Policlínica",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Policlinica+CAIC+Encoberta+Muriae+MG"
  },
  {
    id: 49,
    nome: "POLICLÍNICA SANTA TEREZINHA",
    telefone: "(32) 2020-8079",
    endereco: "Praça dos Esportes, s/n - Santa Terezinha",
    email: "",
    categoria: "Policlínica",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Policlinica+Santa+Terezinha+Muriae+MG"
  },
  {
    id: 50,
    nome: "POLICLÍNICA CLÓVIS DE AQUINO",
    telefone: "(32) 2020-8085",
    endereco: "R. Pedro Muglia, s/n",
    email: "",
    categoria: "Policlínica",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Policlinica+Clovis+de+Aquino+Muriae+MG"
  },
  {
    id: 51,
    nome: "POLICLÍNICA SAFIRA",
    telefone: "(32) 2020-8076",
    endereco: "R. Silvério Campos, s/n",
    email: "",
    categoria: "Policlínica",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Policlinica+Safira+Muriae+MG"
  },
  {
    id: 52,
    nome: "POLICLÍNICA JOSÉ CIRILO",
    telefone: "(32) 2020-8077",
    endereco: "Av. Altino Rodrigues Pereira, 300",
    email: "",
    categoria: "Policlínica",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Policlinica+Jose+Cirilo+Muriae+MG"
  },
  {
    id: 53,
    nome: "CAPS AD III",
    telefone: "(32) 2020-8091 / 2020-8184",
    endereco: "Antigo Sesc, BR-356, km 269, nº 4.555",
    email: "capsadmuriae@gmail.com",
    categoria: "Saúde Mental",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=CAPS+AD+III+Muriae+MG"
  },
  {
    id: 54,
    nome: "CAPS III",
    telefone: "(32) 2020-8062 / (32) 98852-4814",
    endereco: "Antigo Sesc, BR-356, km 269, nº 4.556",
    email: "caps2muriae@gmail.com",
    categoria: "Saúde Mental",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=CAPS+III+Muriae+MG"
  },
  {
    id: 55,
    nome: "CAPSi (Infantil)",
    telefone: "(32) 2020-8148",
    endereco: "Antigo Sesc, BR-356, km 269, nº 4.557",
    email: "capsimuriae@gmail.com",
    categoria: "Saúde Mental",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=CAPSi+Muriae+MG"
  },
  {
    id: 56,
    nome: "AMBULATÓRIO MULTI EM PEDIATRIA",
    telefone: "(32) 98702-7814",
    endereco: "Antigo Sesc, BR-356, km 269, nº 4.555",
    email: "",
    categoria: "Outros",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Antigo+Sesc+BR356+Muriae+MG"
  },
  {
    id: 57,
    nome: "APAE",
    telefone: "(32) 3721-1905",
    endereco: "Rua Estrada da Cerâmica, 370",
    email: "",
    categoria: "Outros",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=APAE+Muriae+MG"
  },
  {
    id: 58,
    nome: "CÂMARA TÉCNICA (FARMÁCIA JUDICIAL)",
    telefone: "(32) 3696-3379",
    endereco: "Av. Maestro Sansão (embaixo do Teatro Zaccaria Marques)",
    email: "",
    categoria: "Outros",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Teatro+Zaccaria+Marques+Muriae+MG"
  },
  {
    id: 59,
    nome: "CASA DE CARIDADE HSP",
    telefone: "(32) 3729-3700",
    endereco: "R. Cel. Izalino, 187",
    email: "",
    categoria: "Outros",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Hospital+Sao+Paulo+Muriae+MG"
  },
  {
    id: 60,
    nome: "CEAE",
    telefone: "(32) 2020-8059",
    endereco: "Dr. Ivan Américo Porcaro, 161",
    email: "",
    categoria: "Outros",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rua+Dr+Ivan+Americo+Porcaro+161+Muriae+MG"
  },
  {
    id: 61,
    nome: "CENTRO DE IMUNIZAÇÃO",
    telefone: "(32) 3696-3435",
    endereco: "Av. Maestro Sansão, 236",
    email: "",
    categoria: "Outros",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Avenida+Maestro+Sansao+236+Muriae+MG"
  },
  {
    id: 62,
    nome: "CENTRO DE ESPECIALIDADES",
    telefone: "(32) 2020-8090",
    endereco: "R. Dr. Ivan Américo Porcaro, 161",
    email: "",
    categoria: "Outros",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rua+Dr+Ivan+Americo+Porcaro+161+Muriae+MG"
  },
  {
    id: 63,
    nome: "CENTRO DE REABILITAÇÃO",
    telefone: "(32) 2020-8096",
    endereco: "Antigo Sesc, BR-356, km 269, nº 4.555",
    email: "",
    categoria: "Outros",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Antigo+Sesc+BR356+Muriae+MG"
  },
  {
    id: 64,
    nome: "CENTRO DE ESPECIALIDADES ODONTOLÓGICAS",
    telefone: "(32) 2020-8095",
    endereco: "Av. Maestro Sansão, 236",
    email: "",
    categoria: "Outros",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Avenida+Maestro+Sansao+236+Muriae+MG"
  },
  {
    id: 65,
    nome: "CISLESTE",
    telefone: "(32) 3722-1999",
    endereco: "R. Sinval Florêncio da Silva, 250",
    email: "",
    categoria: "Outros",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=CISLESTE+Muriae+MG"
  },
  {
    id: 66,
    nome: "EPIDEMIOLOGIA",
    telefone: "(32) 2020-8123",
    endereco: "Antigo Sesc, BR-356, km 269, nº 4.555",
    email: "",
    categoria: "Outros",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Antigo+Sesc+BR356+Muriae+MG"
  },
  {
    id: 67,
    nome: "FARMÁCIA MUNICIPAL",
    telefone: "(32) 2020-8065 / (32) 3696-3345 / (32) 99934-7167",
    endereco: "Av. Maestro Sansão, 236",
    email: "",
    categoria: "Outros",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Avenida+Maestro+Sansao+236+Muriae+MG"
  },
  {
    id: 68,
    nome: "FUNDAÇÃO CRISTIANO VARELLA",
    telefone: "(32) 3729-7000",
    endereco: "Av. Cristiano Ferreira Varella, 555",
    email: "",
    categoria: "Outros",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Fundacao+Cristiano+Varella+Muriae+MG"
  },
  {
    id: 69,
    nome: "LABORATÓRIO MUNICIPAL",
    telefone: "(32) 2020-8074",
    endereco: "R. Cel. Izalino, s/n",
    email: "",
    categoria: "Outros",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rua+Coronel+Izalino+Muriae+MG"
  },
  {
    id: 70,
    nome: "PLANEJAMENTO FAMILIAR",
    telefone: "(32) 2020-8135",
    endereco: "R. Coronel Izalino, 154",
    email: "",
    categoria: "Outros",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rua+Coronel+Izalino+154+Muriae+MG"
  },
  {
    id: 71,
    nome: "POSTO AVANÇADO DE COLETA EXTERNA (PACE)",
    telefone: "(32) 3729-1280",
    endereco: "R. Dr. Ivan Américo",
    email: "",
    categoria: "Outros",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=PACE+Muriae+MG"
  },
  {
    id: 72,
    nome: "PRONTOCOR",
    telefone: "(32) 3729-3800",
    endereco: "Av. Dr. Passos, 719",
    email: "",
    categoria: "Outros",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Prontocor+Muriae+MG"
  },
  {
    id: 73,
    nome: "SAÚDE AUDITIVA",
    telefone: "(32) 3696-3374",
    endereco: "Av. Maestro Sansão, 236",
    email: "",
    categoria: "Outros",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Avenida+Maestro+Sansao+236+Muriae+MG"
  },
  {
    id: 74,
    nome: "SECRETARIA MUNICIPAL DE SAÚDE",
    telefone: "(32) 3696-3305",
    endereco: "Av. Maestro Sansão, 236",
    email: "saude@muriae.gov.mg.br",
    categoria: "Outros",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Secretaria+Municipal+de+Saude+Muriae+MG"
  },
  {
    id: 75,
    nome: "SERVIÇO DE ATENÇÃO ESPECIALIZADA (SAE)",
    telefone: "(32) 2020-8058",
    endereco: "Av. Maestro Sansão, 269",
    email: "",
    categoria: "Outros",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Avenida+Maestro+Sansao+269+Muriae+MG"
  },
  {
    id: 76,
    nome: "TFD - TRATAMENTO FORA DO DOMICÍLIO",
    telefone: "(32) 2020-8066",
    endereco: "Av. Maestro Sansão, 236 - C",
    email: "",
    categoria: "Outros",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Avenida+Maestro+Sansao+236+Muriae+MG"
  },
  {
    id: 77,
    nome: "UPA 24H",
    telefone: "(32) 99939-2771",
    endereco: "R. Itagibá de Oliveira, 445",
    email: "",
    categoria: "Outros",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=UPA+24H+Muriae+MG"
  },
  {
    id: 78,
    nome: "VIGILÂNCIA AMBIENTAL",
    telefone: "(32) 98854-4126",
    endereco: "Antigo Sesc, BR-356, km 269, nº 4.555",
    email: "",
    categoria: "Outros",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Antigo+Sesc+BR356+Muriae+MG"
  },
  {
    id: 79,
    nome: "VIGILÂNCIA SANITÁRIA",
    telefone: "(32) 2020-8105",
    endereco: "R. Sinval Florêncio da Silva, 2",
    email: "",
    categoria: "Outros",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Vigilancia+Sanitaria+Muriae+MG"
  }
];

// CATEGORIAS DE FILTRO
const categorias = [
  "Todos",
  "Ponto de Apoio",
  "Policlínica",
  "Saúde Mental",
  "UBS",
  "Outros"
];

export default function ContatosPage() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [busca, setBusca] = useState("");

  // FILTRAGEM COMBINADA (TEMA + BUSCA POR NOME OU ENDEREÇO)
  const contatosFiltrados = listaContatos.filter((item) => {
    const bateCategoria = categoriaAtiva === "Todos" || item.categoria === categoriaAtiva;
    const termoBusca = busca.toLowerCase();
    const bateBusca = item.nome.toLowerCase().includes(termoBusca) ||
                      item.endereco.toLowerCase().includes(termoBusca);
    return bateCategoria && bateBusca;
  });

  return (
    <div className={styles.pageWrapper}>
      {/* BANNER SUPERIOR */}
      <section className={styles.heroBanner}>
        <div className={styles.container}>
          <span className={styles.heroBadge}>☎️ Redes de Atendimento</span>
          <h1 className={styles.heroTitle}>Guia de Contatos da Saúde</h1>
          <p className={styles.heroSubtitle}>
            Encontre telefones, endereços, e-mails e localizações das Unidades Básicas, Policlínicas e Centros Especializados de Muriaé.
          </p>
        </div>
      </section>

      <main className={styles.mainContainer}>
        <div className={styles.container}>
          
          {/* CAMPO DE PESQUISA POR NOME */}
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Buscar unidade pelo nome ou endereço..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className={styles.searchInput}
            />
            {busca && (
              <button className={styles.clearBtn} onClick={() => setBusca('')}>
                ✕
              </button>
            )}
          </div>

          {/* FILTROS POR TEMA (ABAS / BOTÕES) */}
          <div className={styles.filterTrack}>
            {categorias.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${categoriaAtiva === cat ? styles.filterBtnActive : ''}`}
                onClick={() => setCategoriaAtiva(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* LISTA DE CARDS DE CONTATO */}
          {contatosFiltrados.length > 0 ? (
            <div className={styles.contactsGrid}>
              {contatosFiltrados.map((contato) => (
                <div key={contato.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.categoryBadge}>{contato.categoria}</span>
                    <h3 className={styles.cardTitle}>{contato.nome}</h3>
                  </div>

                  <div className={styles.cardBody}>
                    {contato.telefone && (
                      <div className={styles.infoRow}>
                        <span className={styles.icon}>📞</span>
                        <div>
                          <strong>Telefone</strong>
                          <p>{contato.telefone}</p>
                        </div>
                      </div>
                    )}

                    {contato.endereco && (
                      <div className={styles.infoRow}>
                        <span className={styles.icon}>📍</span>
                        <div>
                          <strong>Endereço</strong>
                          <p>{contato.endereco}</p>
                        </div>
                      </div>
                    )}

                    {contato.email && (
                      <div className={styles.infoRow}>
                        <span className={styles.icon}>✉️</span>
                        <div>
                          <strong>E-mail</strong>
                          <p>{contato.email}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={styles.cardFooter}>
                    <a
                      href={contato.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.mapsBtn}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      Ver localização no Google Maps ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>🔍</span>
              <h3>Nenhum contato encontrado</h3>
              <p>Não encontramos nenhuma unidade correspondente aos critérios da sua busca.</p>
              <button 
                className={styles.resetSearchBtn}
                onClick={() => { setBusca(''); setCategoriaAtiva('Todos'); }}
              >
                Limpar Filtros
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}