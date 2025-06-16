import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Radio,ExternalLink } from 'lucide-react';

// Exemple de données (à adapter selon ton backend ou config)
const COUNTRIES = [
  {
    "code": "DE",
    "name": "Allemagne",
    "flag": "🇩🇪",
    "tracks": [
      {
        "name": "FunArena Ingolstadt",
        "url": "http://www.apex-timing.com/live-timing/funarena-ingolstadt/index.html?language=de&iframe_id=axiframe_1"
      },
      {
        "name": "Kartbahn Lüneburg",
        "url": "http://live.apex-timing.com/kartbahn-lueneburg/"
      },
      {
        "name": "Kartcenter Grimma",
        "url": "https://www.apex-timing.com/live-timing/kartcenter-grimma/index.html"
      },
    
      {
        "name": "Limpark",
        "url": "http://live.apex-timing.com/Limpark/"
      }
    ]
  },
  {
    "code": "SA",
    "name": "Arabie Saoudite",
    "flag": "🇸🇦",
    "tracks": [
      {
        "name": "The Track Jeddah",
        "url": "https://live.apex-timing.com/thetrackjeddah/"
      }
    ]
  },
  {
    "code": "BE",
    "name": "Belgique",
    "flag": "🇧🇪",
    "tracks": [
      {
        "name": "East Belgium Karting Center",
        "url": "http://www.apex-timing.com/live-timing/eastbelgium-karting/"
      },
      {
        "name": "Goodwill Karting",
        "url": "https://live.apex-timing.com/goodwill-karting/index.html?fbclid=IwZXh0bgNhZW0CMTAAAR1CbBTatiozIzPN7mxnVwGtLRilKS4jxF1bMNzWYz8LnLqHeIhnEXYh3lg_aem_5kYqNHxOl4_eBoRKszxKNA"
      },
      {
        "name": "Karting Des Fagnes",
        "url": "http://www.apex-timing.com/live-timing/karting-mariembourg/"
      },
      {
        "name": "Karting Eupen",
        "url": "http://www.apex-timing.com/live-timing/karting-eupen/index.html"
      },
      {
        "name": "Karting Genk",
        "url": "http://www.apex-timing.com/live-timing/karting-genk/index.html"
      },
      {
        "name": "Karting Spa-Francorchamps",
        "url": "http://www.apex-timing.com/live-timing/animis-timing/"
      },
      {
        "name": "First Kart Inn",
        "url": "http://www.apex-timing.com/live-timing/firstkartinn/"
      },
      {
        "name": "Wavre Indoor Karting WIK",
        "url": "https://www.apex-timing.com/live-timing/wik/index.html"
      },
      {
        "name": "WorldKarts",
        "url": "http://www.apex-timing.com/live-timing/worldkarts/"
      },
    
    ]
  },
  {
    "code": "CA",
    "name": "Canada",
    "flag": "🇨🇦",
    "tracks": [
      {
        "name": "KCR Karting",
        "url": "http://www.apex-timing.com/live-timing/kcrkarting/"
      }
    ]
  },
  {
    "code": "DK",
    "name": "Danemark",
    "flag": "🇩🇰",
    "tracks": [
      {
        "name": "Dasu",
        "url": "https://www.apex-timing.com/live-timing/dasu/index.html"
      },
      {
        "name": "Roskilde Racing Center",
        "url": "https://www.apex-timing.com/live-timing/roskilde/index.html"
      }
    ]
  },
  {
    "code": "AE",
    "name": "Emirats Arabes Unis",
    "flag": "🇦🇪",
    "tracks": [
      {
        "name": "Al Ain Raceway",
        "url": "http://www.apex-timing.com/live-timing/alainraceway/index.html"
      }
    ]
  },
  {
    "code": "ES",
    "name": "Espagne",
    "flag": "🇪🇸",
    "tracks": [
      {
        "name": "Circuit Osona - Live timing carreras de karting en vivo",
        "url": "https://live.apex-timing.com/circuitosona/"
      },
      {
        "name": "Henakart",
        "url": "http://www.apex-timing.com/live-timing/HENAKART/index.html"
      },
      {
        "name": "Kart Center Campillos",
        "url": "https://www.apex-timing.com/live-timing/kartcenter-campillos/index.html"
      },
      {
        "name": "Karting Club Los Santos",
        "url": "http://www.apex-timing.com/live-timing/karting-lossantos/"
      },
      {
        "name": "Karting Pinto",
        "url": "http://www.apex-timing.com/live-timing/karting-pinto/"
      },
      {
        "name": "karting Sevilla",
        "url": "https://live.apex-timing.com/karting-sevilla/"
      },
      {
        "name": "Kartodromo de Tapia",
        "url": "http://www.apex-timing.com/live-timing/kartodromo-de-tapia/"
      },
      
    ]
  },
  {
    "code": "FI",
    "name": "Finlande",
    "flag": "🇫🇮",
    "tracks": [
      {
        "name": "VM Karting Center",
        "url": "https://www.apex-timing.com/live-timing/vm-karting/index.html"
      }
    ]
  },
  {
    "code": "FR",
    "name": "France",
    "flag": "🇫🇷",
    "tracks": [
      {
        "name": "ACO Le Mans Karting",
        "url": "http://www.apex-timing.com/live-timing/lemans-karting/index.html"
      },
      {
        "name": "ACO Le Mans Karting 2",
        "url": "http://www.apex-timing.com/live-timing/lemans-karting2/"
      },
      {
        "name": "Actua Karting",
        "url": "http://www.apex-timing.com/live-timing/actua/"
      },
      {
        "name": "Ardennes Karting",
        "url": "http://www.apex-timing.com/live-timing/ardenneskarting/index.html"
      },
      {
        "name": "Brest Kart Electrique",
        "url": "https://www.apex-timing.com/live-timing/brest-kart-electrique/index.html"
      },
      {
        "name": "Brignoles Karting Loisirs",
        "url": "http://www.apex-timing.com/live-timing/brignoles-karting-loisir/index.html"
      },
      {
        "name": "Cap Karting",
        "url": "http://www.apex-timing.com/live-timing/capkarting/"
      },

      {
        "name": "Circuit De Bresse",
        "url": "http://www.apex-timing.com/live-timing/circuitdebresse/"
      },
      {
        "name": "Circuit De l'Enclos",
        "url": "http://www.apex-timing.com/live-timing/circuit-de-lenclos/"
      },
      {
        "name": "Circuit De l'Europe",
        "url": "http://www.apex-timing.com/live-timing/circuit-europe/"
      },
      {
        "name": "Circuit Karting Besançon",
        "url": "https://live.apex-timing.com/ckbesancon/"
      },
      {
        "name": "Circuit Karting Paul Ricard",
        "url": "http://www.apex-timing.com/live-timing/circuitpaulricardkarting/"
      },
      {
        "name": "CRK Auvergne",
        "url": "http://www.apex-timing.com/live-timing/crkauvergne/index.html"
      },
      {
        "name": "Dunois Kart",
        "url": "http://www.apex-timing.com/live-timing/dunois-kart/"
      },
      {
        "name": "GP Kart Concept",
        "url": "https://www.apex-timing.com/live-timing/gpkart-concept/index.html"
      },
      {
        "name": "Kart Escale",
        "url": "http://www.apex-timing.com/live-timing/kart-escale/"
      },
      {
        "name": "Kart Origins Corbas",
        "url": "http://www.apex-timing.com/live-timing/kart-origins-corbas/index.html"
      },
      {
        "name": "Kart Race Witry",
        "url": "https://www.apex-timing.com/live-timing/kartrace-witry/index.html"
      },
      {
        "name": "Kart Sensation",
        "url": "http://www.apex-timing.com/live-timing/kart-sensation/index.html"
      },
      {
        "name": "Karthors",
        "url": "http://www.apex-timing.com/live-timing/karthors/"
      },
      {
        "name": "Karting 45 Saint Benoit sur Loire",
        "url": "http://www.apex-timing.com/live-timing/karting-45/"
      },
      {
        "name": "Karting Beaucaire Julie Tonelli",
        "url": "http://www.apex-timing.com/live-timing/kartingbeaucaire-julietonelli/index.html"
      },
      {
        "name": "Karting Caen",
        "url": "https://www.apex-timing.com/live-timing/karting-caen/index.html"
      },
      {
        "name": "Karting Caudecoste",
        "url": "https://www.apex-timing.com/live-timing/karting-caudecoste/index.html"
      },
      {
        "name": "Karting De Muret",
        "url": "http://www.apex-timing.com/live-timing/kartingmuret/"
      },
      {
        "name": "Karting De Pers",
        "url": "http://www.apex-timing.com/live-timing/karting-pers/index.html"
      },
      {
        "name": "Karting De Saintes",
        "url": "http://www.apex-timing.com/live-timing/karting-de-saintes/"
      },
      {
        "name": "Karting Espoey",
        "url": "http://www.apex-timing.com/live-timing/karting-espoey/index.html"
      },
      {
        "name": "Karting Haute Picardie",
        "url": "http://www.apex-timing.com/live-timing/karting-haute-picardie/index.html"
      },
      {
        "name": "Karting Loisirs Neuilly",
        "url": "http://live.apex-timing.com/kln/"
      },
      {
        "name": "Karting Loudun",
        "url": "https://www.apex-timing.com/live-timing/karting-loudun/index.html"
      },
      {
        "name": "Karting Payerne",
        "url": "http://www.apex-timing.com/live-timing/karting-payerne/"
      },
      {
        "name": "Karting Roussillon",
        "url": "http://live.apex-timing.com/grand-circuit-du-roussillon/index.html"
      },
      {
        "name": "Karting Rumilly",
        "url": "https://live.apex-timing.com/karting-rumilly/"
      },
      {
        "name": "Kartland",
        "url": "http://www.apex-timing.com/live-timing/kartland/"
      },
      {
        "name": "KLL Loisirs Douvrin",
        "url": "http://www.apex-timing.com/live-timing/kll-loisirs-douvrin/index.html?language=fr"
      },
      {
        "name": "Laval Loisirs Kart",
        "url": "http://www.apex-timing.com/live-timing/lavalloisirskart/"
      },
      {
        "name": "LF Karting",
        "url": "https://www.apex-timing.com/live-timing/lfkarting/"
      },
      {
        "name": "LKS Karting",
        "url": "http://www.apex-timing.com/live-timing/lks-karting/index.html?language=fr&iframe_id=axiframe_3"
      },
      {
        "name": "Magny Cours",
        "url": "http://www.apex-timing.com/live-timing/karting-magny-cours/"
      },
      {
        "name": "Megakart Vias",
        "url": "https://live.apex-timing.com/megakart-vias/"
      },
      {
        "name": "Metz Kart Indoor",
        "url": "http://www.apex-timing.com/live-timing/metz-kart-indoor/"
      },
      {
        "name": "MK Circuit",
        "url": "http://www.apex-timing.com/live-timing/mk-circuit/"
      },
      {
        "name": "MK Racing",
        "url": "http://www.apex-timing.com/live-timing/mkracing/index.html"
      },
      {
        "name": "NTKart Lexy",
        "url": "http://www.apex-timing.com/live-timing/ntkart/index.html"
      },
      {
        "name": "Ouest Karting",
        "url": "http://www.apex-timing.com/live-timing/ouestkarting/"
      },
      {
        "name": "Paris Kart Indoor",
        "url": "http://www.apex-timing.com/live-timing/paris-kart/"
      },
      {
        "name": "Passion Karting 16",
        "url": "http://live.apex-timing.com/passionkarting16/"
      },
      {
        "name": "Plein Gaz Karting",
        "url": "https://live.apex-timing.com/pleingazkarting44/"
      },
      {
        "name": "Pole Mecanique Karting Ales",
        "url": "http://live.apex-timing.com/ales-racing-system/"
      },
      {
        "name": "Prestige Karting",
        "url": "http://www.apex-timing.com/live-timing/prestige-karting/"
      },
      {
        "name": "Racing Kart Cormeilles",
        "url": "http://www.apex-timing.com/live-timing/rkc/"
      },
      {
        "name": "Racing Kart Du Mans",
        "url": "http://www.apex-timing.com/live-timing/racingkartdumans/"
      },
      {
        "name": "RKO Angerville",
        "url": "http://www.apex-timing.com/live-timing/rko-angerville/"
      },
      {
        "name": "Sens Espace Karting SEK",
        "url": "http://www.apex-timing.com/live-timing/sek/"
      },
      {
        "name": "Sologne Karting",
        "url": "http://www.apex-timing.com/live-timing/solognekarting/index.html"
      },
      {
        "name": "SoloKart",
        "url": "http://www.apex-timing.com/live-timing/solokart/"
      },
      {
        "name": "Speedkart",
        "url": "http://www.apex-timing.com/live-timing/speedkart/"
      },
      {
        "name": "Sport Karting Circuit de la Vallée",
        "url": "http://www.apex-timing.com/live-timing/sportkarting/index.html"
      },
      {
        "name": "TopGun Evasion",
        "url": "http://www.apex-timing.com/live-timing/topgun-evasion/index.html"
      },
      {
        "name": "Vaison Piste",
        "url": "http://live.apex-timing.com/vaison-piste/"
      },
      

    ]
  },
  {
    "code": "IT",
    "name": "Italie",
    "flag": "🇮🇹",
    "tracks": [
      {
        "name": "Adria Raceway",
        "url": "http://www.apex-timing.com/live-timing/adria-karting/index.html"
      },
      {
        "name": "Circuito Di Siena",
        "url": "http://www.apex-timing.com/live-timing/circuito-siena/"
      },
      {
        "name": "Circuit Sole luna Vittoria",
        "url": "http://www.apex-timing.com/live-timing/competitions-karting-club/index.html"
      },
      {
        "name": "Cremona Circuit",
        "url": "http://www.apex-timing.com/live-timing/cremona-circuit/index.html"
      },
      {
        "name": "Franciacorta Karting Track",
        "url": "http://www.apex-timing.com/live-timing/franciacorta-karting-track/index.html"
      },
      {
        "name": "HolyKart Roma",
        "url": "http://www.apex-timing.com/live-timing/holykartroma/index.html"
      },
      {
        "name": "KZR Kart Indoor",
        "url": "http://www.apex-timing.com/live-timing/pgkart/"
      },
      {
        "name": "Lignano Circuit Kart FVG",
        "url": "http://www.apex-timing.com/live-timing/lignano-circuit/index.html"
      },
      {
        "name": "Misanino Kart Circuit",
        "url": "http://www.apex-timing.com/live-timing/misanino-kart/"
      },
      {
        "name": "PGKart Indoor",
        "url": "http://www.apex-timing.com/live-timing/ams-racing/index.html"
      },
      {
        "name": "Pista Azzura",
        "url": "http://www.apex-timing.com/live-timing/pista-azzurra/index.html"
      },
      {
        "name": "Pista del Sole",
        "url": "https://live.apex-timing.com/pista-del-sole/"
      },
      {
        "name": "Raceland Vicenza",
        "url": "http://www.apex-timing.com/live-timing/raceland-vicenza/index.html"
      },
      {
        "name": "Ricca Karting",
        "url": "https://www.apex-timing.com/live-timing/ricca-karting/index.html"
      },
      {
        "name": "South Garda Karting",
        "url": "http://www.apex-timing.com/live-timing/southgardakarting/index.html"
      },
    ]
  },
  {
    "code": "JP",
    "name": "Japon",
    "flag": "🇯🇵",
    "tracks": [
      {
        "name": "Harbor Circuit Kisarazu",
        "url": "https://www.apex-timing.com/live-timing/harbor-circuit-kisarazu/index.html"
      },
      {
        "name": "Harbor Circuit Makuhari Shintoshin",
        "url": "https://live.apex-timing.com/harbor-circuit-makuhari/"
      },
      {
        "name": "Nonhoi Circuit",
        "url": "https://www.apex-timing.com/live-timing/nonhoi-circuit/index.html"
      },
    ]
  },
  {
    "code": "LB",
    "name": "Liban",
    "flag": "🇱🇧",
    "tracks": [
      {
        "name": "CityKart Lebanon",
        "url": "http://www.apex-timing.com/live-timing/citykart-lebanon/"
      }
    ]
  },
  {
    "code": "MA",
    "name": "Maroc",
    "flag": "🇲🇦",
    "tracks": [
      {
        "name": "Karting Agadir",
        "url": "https://live.apex-timing.com/mrkagadir/"
      }
    ]
  },
  {
    "code": "NL",
    "name": "Pays-Bas",
    "flag": "🇳🇱",
    "tracks": [
      
      {
        "name": "Kartbaan Oldenzaal",
        "url": "https://live.apex-timing.com/kartbaanoldenzaal/"
      },
      {
        "name": "Kartcentrum Lelystad",
        "url": "http://www.apex-timing.com/live-timing/kartcentrum-lelystad/"
      },
    ]
  },
  {
    "code": "PL",
    "name": "Pologne",
    "flag": "🇵🇱",
    "tracks": [
      {
        "name": "Silver Hotel",
        "url": "https://www.apex-timing.com/live-timing/silverhotel/index.html"
      }
    ]
  },
  {
    "code": "PT",
    "name": "Portugal",
    "flag": "🇵🇹",
    "tracks": [
      {
        "name": "Kartodromo Cabo do Mundo",
        "url": "http://www.apex-timing.com/live-timing/cabodomundokarting/"
      }
    ]
  },
  {
    "code": "GB",
    "name": "Royaume-Uni",
    "flag": "🇬🇧",
    "tracks": [
      {
        "name": "Cornwall Karting",
        "url": "http://www.apex-timing.com/live-timing/cornwall-karting/index.html"
      },
      {
        "name": "ELK Motorsport",
        "url": "http://www.apex-timing.com/live-timing/elk-motorsport/"
      },
      {
        "name": "Kimbolton Kart Club HKRC",
        "url": "http://www.apex-timing.com/live-timing/hkrc/"
      },
      {
        "name": "Larkhall Circuit",
        "url": "http://www.apex-timing.com/live-timing/larkhall-circuit/"
      },
      {
        "name": "SKRC Shenington Kart Club",
        "url": "http://www.apex-timing.com/live-timing/shenington/"
      },
      {
        "name": "TVKC Live timing",
        "url": "http://www.apex-timing.com/live-timing/tvkc/"
      },
      {
        "name": "Whilton Mill Kart Club",
        "url": "http://www.apex-timing.com/live-timing/whiltonmill/"
      },
      {
        "name": "Xtreme Karting Edinburgh",
        "url": "http://www.apex-timing.com/live-timing/xtremekarting-edinburgh/index.html"
      },
      {
        "name": "Xtreme Karting Falkirk",
        "url": "https://www.apex-timing.com/live-timing/xtremekarting-falkirk/index.html"
      }
    ]
  },
  {
    "code": "RU",
    "name": "Russie",
    "flag": "🇷🇺",
    "tracks": [
      {
        "name": "Primo Karting",
        "url": "http://www.apex-timing.com/live-timing/primo-karting/index.html"
      }
    ]
  },
  {
    "code": "SK",
    "name": "Slovaquie",
    "flag": "🇸🇰",
    "tracks": [
      {
        "name": "Max 60",
        "url": "https://live.apex-timing.com/motokary-max60/"
      },
      {
        "name": "Slovak Karting Center",
        "url": "http://www.apex-timing.com/live-timing/slovak-karting-center/"
      },
      
    ]
  },
  {
    "code": "SE",
    "name": "Suède",
    "flag": "🇸🇪",
    "tracks": [
      {
        "name": "Gokartcentralen Goteborg",
        "url": "http://live.apex-timing.com/gokartcentralen-goteborg/?ml=1&language=en&iframe_id=axiframe_2"
      },
      {
        "name": "Gokartcentralen Kungalv",
        "url": "http://live.apex-timing.com/gokartcentralen-kungalv/"
      }
    ]
  },
  {
    "code": "CZ",
    "name": "Tchéquie",
    "flag": "🇨🇿",
    "tracks": [
      {
        "name": "Kart Centrum Modrice Brno",
        "url": "http://www.apex-timing.com/live-timing/kartcentrum-brno/index.html"
      },
      {
        "name": "Motokary Hodonin",
        "url": "http://live.apex-timing.com/motokaryhodonin/"
      },
      {
        "name": "Steel Ring Trinec",
        "url": "http://www.apex-timing.com/live-timing/steelring/index.html"
      },
    ]
  },
  {
    "code": "US",
    "name": "USA",
    "flag": "🇺🇸",
    "tracks": [
      {
        "name": "Fastlane indoor Racing",
        "url": "https://www.apex-timing.com/live-timing/fastlane-indoor-racing/index.html"
      },
      {
        "name": "Orlando Kart Center",
        "url": "http://www.apex-timing.com/live-timing/orlandokartcenter/index.html"
      },
      {
        "name": "Rogue Karting",
        "url": "http://www.apex-timing.com/live-timing/rogue-karting/index.html"
      },
      {
        "name": "Rush Hour Karting",
        "url": "http://www.apex-timing.com/live-timing/rushhour-karting/index.html"
      }
    ]
  }
];

const LiveTimingSelector = () => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('');

  const country = COUNTRIES.find(c => c.code === selectedCountry);
  const track = country?.tracks.find(t => t.name === selectedTrack);

  return (
    <Card className="w-full glassmorphism-card shadow-xl overflow-hidden">
     <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-4 border-b border-primary/30">        
        <CardTitle className="text-lg md:text-xl font-bold text-primary flex items-center gap-1 md:gap-2">
            <Radio className="h-4 w-4 md:h-5 md:w-5" />LiveTiming</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/80 hover:bg-primary text-red shadow-lg backdrop-blur border border-primary/30 transition-all duration-150"
      >
        <Select value={selectedCountry} onValueChange={value => {
          setSelectedCountry(value);
          setSelectedTrack('');
        }}>
          <SelectTrigger className="w-full">
            {selectedCountry
              ? <>
                  <span className="mr-2">{country?.flag}</span>
                  {country?.name}
                </>
              : 'Choisir un pays'}
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map(c => (
              <SelectItem key={c.code} value={c.code}>
                <span className="mr-2">{c.flag}</span>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {country && (
          <Select value={selectedTrack} onValueChange={setSelectedTrack}>
            <SelectTrigger className="w-full">
              {selectedTrack || 'Choisir une piste'}
            </SelectTrigger>
            <SelectContent>
              {country.tracks.map(t => (
                <SelectItem key={t.name} value={t.name}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {track && (
          <Button
  className="w-full md:w-auto bg-secondary/95 hover:bg-secondary text-primary shadow-lg backdrop-blur border border-secondary/30 transition-all duration-150"
  onClick={() => window.open(track.url, '_blank', 'noopener')}
>
  <span className="flex items-center gap-2">
    <span>Ouvrir LiveTiming</span>
    <ExternalLink className="h-4 w-4" />
  </span>
</Button>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveTimingSelector;