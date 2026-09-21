-- Auditoría discográfica D-02C · Gerena + Rosario de Sanlúcar la Mayor
-- Solo DML sobre el modelo First Edition existente.
-- No introduce DDL, RLS ni modifica las doce entidades clasificadas «NO LOCALIZADO».

do $$
declare
  v_gerena uuid;
  v_rosario uuid;
  v_gerena_source uuid;
  v_rosario_apple_source uuid;
  v_catalog jsonb := '[
  {
    "band_slug": "banda-municipal-musica-gerena",
    "title": "Sangre de Amor Coronada",
    "release_type": "album",
    "release_year": 2026,
    "release_date": null,
    "release_date_text": "2026",
    "cover_image_path": "https://i.scdn.co/image/ab67616d0000b273077fd7251bcc299bd1352a4e",
    "spotify_url": "https://open.spotify.com/album/5MPEE30HQonhkzqKLqD72F",
    "external_url": null,
    "source_url": "https://open.spotify.com/artist/0tQhg109ySNXCC0g7Xzivu",
    "tracks": [
      {
        "sequence_no": 1,
        "title": "Virgen de la Sangre",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/2VKlQcLHB4jjLOHr8UEJGu",
        "notes": null
      },
      {
        "sequence_no": 2,
        "title": "Sangre Coronada",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/1dISNKlMB30k71JgQNWWbR",
        "notes": null
      },
      {
        "sequence_no": 3,
        "title": "Madre de los Cruceros de Gerena",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/443IwGmm3u8iQc1OveQMKq",
        "notes": null
      },
      {
        "sequence_no": 4,
        "title": "La Sangre de Gerena",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/46sI9YM4EQDd3Ty3Qi1hcd",
        "notes": null
      },
      {
        "sequence_no": 5,
        "title": "Reina de Vera-Cruz",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/2A32vmXTSJMn56UlarN7ZR",
        "notes": null
      },
      {
        "sequence_no": 6,
        "title": "Sangre Crucera",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/0WFKqMiG5obr8n1nrk7wfH",
        "notes": null
      },
      {
        "sequence_no": 7,
        "title": "Virgen de la Sangre Coronada",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/1p8jqSD7Pv5LnDiecwRRqP",
        "notes": null
      },
      {
        "sequence_no": 8,
        "title": "Aniversario en Vera-Cruz",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/5vWKHCIwZ25oWbcQybxUne",
        "notes": null
      },
      {
        "sequence_no": 9,
        "title": "Reina de Gerena Coronada",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/0GqMFSeZCXklTSAtuapboY",
        "notes": null
      },
      {
        "sequence_no": 10,
        "title": "Madre mía de la Sangre | Himno de la Coronación",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/7JaLCLuNdcqp1kTgKE4uuq",
        "notes": null
      }
    ]
  },
  {
    "band_slug": "banda-municipal-musica-gerena",
    "title": "La Sangre de Gerena",
    "release_type": "single",
    "release_year": 2026,
    "release_date": null,
    "release_date_text": "2026",
    "cover_image_path": "https://i.scdn.co/image/ab67616d0000b273c04739ccbf6bcaccfe2f1751",
    "spotify_url": "https://open.spotify.com/album/2FOBwoTUSYdnaBT3VTeGPZ",
    "external_url": null,
    "source_url": "https://open.spotify.com/artist/0tQhg109ySNXCC0g7Xzivu",
    "tracks": [
      {
        "sequence_no": 1,
        "title": "La Sangre de Gerena",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/1YWfrNUmsc0s75RlKr8tmm",
        "notes": null
      }
    ]
  },
  {
    "band_slug": "banda-municipal-musica-gerena",
    "title": "Madre Mía de la Sangre | Himno de la Coronación",
    "release_type": "single",
    "release_year": 2026,
    "release_date": null,
    "release_date_text": "2026",
    "cover_image_path": "https://i.scdn.co/image/ab67616d0000b273436882149968611e0d34d9ff",
    "spotify_url": "https://open.spotify.com/album/7miFXfnk4tzuFFovnLjdEk",
    "external_url": null,
    "source_url": "https://open.spotify.com/artist/0tQhg109ySNXCC0g7Xzivu",
    "tracks": [
      {
        "sequence_no": 1,
        "title": "Madre Mía de la Sangre | Himno de la Coronación",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/1giXQ2BQhbNOXSnQj4qrzY",
        "notes": null
      }
    ]
  },
  {
    "band_slug": "banda-municipal-musica-gerena",
    "title": "Reina de Gerena Coronada",
    "release_type": "single",
    "release_year": 2026,
    "release_date": null,
    "release_date_text": "2026",
    "cover_image_path": "https://i.scdn.co/image/ab67616d0000b27333ee16addc432dfb37423337",
    "spotify_url": "https://open.spotify.com/album/3smn9oizYQwzVFN5GmzvoX",
    "external_url": null,
    "source_url": "https://open.spotify.com/artist/0tQhg109ySNXCC0g7Xzivu",
    "tracks": [
      {
        "sequence_no": 1,
        "title": "Reina de Gerena Coronada",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/7vMYnj0DPjnXjD0pV4JFLY",
        "notes": null
      }
    ]
  },
  {
    "band_slug": "banda-municipal-musica-gerena",
    "title": "Aniversario Soleano (En Directo)",
    "release_type": "album",
    "release_year": 2025,
    "release_date": null,
    "release_date_text": "2025",
    "cover_image_path": "https://i.scdn.co/image/ab67616d0000b273bbc021b73281cdcc7e11d5c8",
    "spotify_url": "https://open.spotify.com/album/2cHE6MY6LFXp37F71cTUR9",
    "external_url": null,
    "source_url": "https://open.spotify.com/artist/0tQhg109ySNXCC0g7Xzivu",
    "tracks": [
      {
        "sequence_no": 1,
        "title": "Soledad Coronada - En Directo",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/5LAzOPT4kzJvWRyUfhgiSN",
        "notes": null
      },
      {
        "sequence_no": 2,
        "title": "Señor de la Paz - En Directo",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/0cVX1nqcxiBOqyBSxMHKyf",
        "notes": null
      },
      {
        "sequence_no": 3,
        "title": "Una Corona para mi Virgen - En Directo",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/3omUXHOdPAdiLEe7fH5ksi",
        "notes": null
      },
      {
        "sequence_no": 4,
        "title": "Soledad - En Directo",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/6gtMHoJZ7NGNP5c3ECaTw5",
        "notes": null
      },
      {
        "sequence_no": 5,
        "title": "Tú eres el orgullo de nuestro pueblo - En Directo",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/2wtaqYtvyDXcMGWQnLKDa3",
        "notes": null
      },
      {
        "sequence_no": 6,
        "title": "Mortis Victor - En Directo",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/4P4q73Lbkv0QAQ7X3jU3Bf",
        "notes": null
      },
      {
        "sequence_no": 7,
        "title": "Aniversario Soleano - En Directo",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/6q7BYdo8yJNUNdu852rIWR",
        "notes": null
      }
    ]
  },
  {
    "band_slug": "banda-municipal-musica-gerena",
    "title": "Flor del Amanecer (En Directo)",
    "release_type": "ep",
    "release_year": 2025,
    "release_date": null,
    "release_date_text": "2025",
    "cover_image_path": "https://i.scdn.co/image/ab67616d0000b2738f6ad25d7b51f7d5a966acce",
    "spotify_url": "https://open.spotify.com/album/3HPO7nM9oqj9oEcmwfegNf",
    "external_url": null,
    "source_url": "https://open.spotify.com/artist/0tQhg109ySNXCC0g7Xzivu",
    "tracks": [
      {
        "sequence_no": 1,
        "title": "Pasa la Virgen Macarena - En Directo",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/3CnuIqbcqWpfsfopICzI7T",
        "notes": null
      },
      {
        "sequence_no": 2,
        "title": "Soleá Dame la Mano - En Directo",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/4qRtBO7gcSoUKeZAfl56GA",
        "notes": null
      },
      {
        "sequence_no": 3,
        "title": "Coronación - En Directo",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/0DBuFAx5WHuUDSPFpC4xvz",
        "notes": null
      },
      {
        "sequence_no": 4,
        "title": "Siempre Macarena - En Directo",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/1sV8nI9uifqq7Rwo2Tu7HQ",
        "notes": null
      },
      {
        "sequence_no": 5,
        "title": "Virgen de las Lágrimas - En Directo",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/3C4YdQX4I3HWDNSNMzVPQW",
        "notes": null
      }
    ]
  },
  {
    "band_slug": "banda-municipal-musica-gerena",
    "title": "Siempre por Dolores (En Directo)",
    "release_type": "ep",
    "release_year": 2024,
    "release_date": null,
    "release_date_text": "2024",
    "cover_image_path": "https://i.scdn.co/image/ab67616d0000b273174ac6f2b0281a87ba055dc5",
    "spotify_url": "https://open.spotify.com/album/3pHzFL4b9UeGfopweW4Cxb",
    "external_url": null,
    "source_url": "https://open.spotify.com/artist/0tQhg109ySNXCC0g7Xzivu",
    "tracks": [
      {
        "sequence_no": 1,
        "title": "Nuestra Señora de los Dolores - En Directo",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/3BEi32UfhjbyDrfJLR4NUp",
        "notes": null
      },
      {
        "sequence_no": 2,
        "title": "Miserere Mei, Deus - En Directo",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/3ObsopDnLODP1TEqjGEHqF",
        "notes": null
      },
      {
        "sequence_no": 3,
        "title": "Juana De Arco - En Directo",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/4pHWtAQIrFUWY13jpXh1K6",
        "notes": null
      },
      {
        "sequence_no": 4,
        "title": "El Cristo de la Lanzada - En Directo",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/3nx4nGQ1gi5xWXkInl61Oy",
        "notes": null
      },
      {
        "sequence_no": 5,
        "title": "Nuestro Padre Jesús - En Directo",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/3SJl35xQHHyxLtCUaHxXhQ",
        "notes": null
      },
      {
        "sequence_no": 6,
        "title": "Cristo de la Defensión - En Directo",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/3SokLgxYQglDfbGIrPk7d5",
        "notes": null
      }
    ]
  },
  {
    "band_slug": "banda-municipal-musica-gerena",
    "title": "Siete Lágrimas",
    "release_type": "single",
    "release_year": 2024,
    "release_date": null,
    "release_date_text": "2024",
    "cover_image_path": "https://i.scdn.co/image/ab67616d0000b2739afbd5b0fd0b17e7bdbc00bb",
    "spotify_url": "https://open.spotify.com/album/228KVvMnEy77BKjmOj2IRc",
    "external_url": null,
    "source_url": "https://open.spotify.com/artist/0tQhg109ySNXCC0g7Xzivu",
    "tracks": [
      {
        "sequence_no": 1,
        "title": "Siete Lágrimas",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/4xLHImFHleEubu4qDnkjoJ",
        "notes": null
      }
    ]
  },
  {
    "band_slug": "banda-municipal-musica-gerena",
    "title": "Carlos Herrera (Pasodoble)",
    "release_type": "single",
    "release_year": 2023,
    "release_date": null,
    "release_date_text": "2023",
    "cover_image_path": "https://i.scdn.co/image/ab67616d0000b27346eee71adccd08d15b525e91",
    "spotify_url": "https://open.spotify.com/album/1VGh8cwTTzqUUwTIjMuBL8",
    "external_url": null,
    "source_url": "https://open.spotify.com/artist/0tQhg109ySNXCC0g7Xzivu",
    "tracks": [
      {
        "sequence_no": 1,
        "title": "Carlos Herrera - Pasodoble",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/0EQOy6PVcXhaRworNzOUpg",
        "notes": null
      }
    ]
  },
  {
    "band_slug": "banda-municipal-musica-gerena",
    "title": "Victor Garcia Rayo (Pasodoble)",
    "release_type": "single",
    "release_year": 2023,
    "release_date": null,
    "release_date_text": "2023",
    "cover_image_path": "https://i.scdn.co/image/ab67616d0000b2734aed77d69e527c171ca572be",
    "spotify_url": "https://open.spotify.com/album/7HRZFDU6neVsjOSZITFWyK",
    "external_url": null,
    "source_url": "https://open.spotify.com/artist/0tQhg109ySNXCC0g7Xzivu",
    "tracks": [
      {
        "sequence_no": 1,
        "title": "Victor Garcia Rayo - Pasodoble",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/0iZ89V4eIoIxQtQtaf8POG",
        "notes": null
      }
    ]
  },
  {
    "band_slug": "banda-municipal-musica-gerena",
    "title": "Dios te Salve Macarena",
    "release_type": "ep",
    "release_year": 2023,
    "release_date": null,
    "release_date_text": "2023",
    "cover_image_path": "https://i.scdn.co/image/ab67616d0000b2739d356ec4be92221d7b797f19",
    "spotify_url": "https://open.spotify.com/album/35764AAUf0nSTCLvsxk3OI",
    "external_url": null,
    "source_url": "https://open.spotify.com/artist/0tQhg109ySNXCC0g7Xzivu",
    "tracks": [
      {
        "sequence_no": 1,
        "title": "Dios te Salve Macarena",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/75snsOM388mdeSwuMXiffK",
        "notes": null
      },
      {
        "sequence_no": 2,
        "title": "En tus Manos, Consolación",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/6MrpqWjfHfT1ZMN5s2uDtP",
        "notes": null
      },
      {
        "sequence_no": 3,
        "title": "Estudiantes",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/2gW7XAZ67mHLvGIvKdyHFk",
        "notes": null
      },
      {
        "sequence_no": 4,
        "title": "Protégeme",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/4Fcvw4F0crht00hBASYhiD",
        "notes": null
      },
      {
        "sequence_no": 5,
        "title": "Madre Cigarreras",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/3uFSFAKSaUBbCpkRxprdY6",
        "notes": null
      },
      {
        "sequence_no": 6,
        "title": "Se Arrodilla Triana",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/4dxek2ZpyCrGWWlrRlvHFt",
        "notes": null
      }
    ]
  },
  {
    "band_slug": "banda-municipal-musica-gerena",
    "title": "Rocío y Azahar de Pasión",
    "release_type": "album",
    "release_year": 2003,
    "release_date": null,
    "release_date_text": "2003",
    "cover_image_path": "https://i.scdn.co/image/ab67616d0000b273d5b1a6ab856d48a379351c42",
    "spotify_url": "https://open.spotify.com/album/0zMycBl2lSVMAodg32TTQI",
    "external_url": null,
    "source_url": "https://open.spotify.com/artist/0tQhg109ySNXCC0g7Xzivu",
    "tracks": [
      {
        "sequence_no": 1,
        "title": "Rocío",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/6XDAluqHzLuKHvlfKQslFs",
        "notes": null
      },
      {
        "sequence_no": 2,
        "title": "María Santísima del Sol",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/1q9ggEUIzNCt6ivesu5I4o",
        "notes": null
      },
      {
        "sequence_no": 3,
        "title": "Madre Hiniesta",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/7FTxhHlpbEvJH1j2lmXK5K",
        "notes": null
      },
      {
        "sequence_no": 4,
        "title": "Dolores de Soledad",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/0hAwoo1y8enBqd2Y669Ejt",
        "notes": null
      },
      {
        "sequence_no": 5,
        "title": "Madre de los Cruceros de Gerena",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/2evUBbqEkCWwBANo4v97uU",
        "notes": null
      },
      {
        "sequence_no": 6,
        "title": "Señor de la Paz",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/3HcHAcoFXBVjaTxFoLKfbL",
        "notes": null
      },
      {
        "sequence_no": 7,
        "title": "Cristo de la Reja",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/1F65G4T8aAL4vECOUGwZS4",
        "notes": null
      },
      {
        "sequence_no": 8,
        "title": "Soledad, Rosa de Castilleja",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/5Q5blhScaauW0BDauCHZBp",
        "notes": null
      },
      {
        "sequence_no": 9,
        "title": "Mayor Dolor de María",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/1NZMwVZwjMjRGc6zoZbuMr",
        "notes": null
      },
      {
        "sequence_no": 10,
        "title": "Soledad Coronada",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/5cKDnyV1uXV2Ku4hnUsvFY",
        "notes": null
      },
      {
        "sequence_no": 11,
        "title": "Caridad del Guadalquivir",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/0SG3r7lz3PZURWIlCXanxt",
        "notes": null
      },
      {
        "sequence_no": 12,
        "title": "Tus Dolores Son Mis Glorias",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/69g0PFUKFXNOh04KniJdQM",
        "notes": null
      },
      {
        "sequence_no": 13,
        "title": "Nuestra Señora de la Encarnación",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/6h8V9ZgMou5sHtypyzC3yj",
        "notes": null
      }
    ]
  },
  {
    "band_slug": "banda-municipal-musica-gerena",
    "title": "Por Calles y Plazas",
    "release_type": "album",
    "release_year": 1998,
    "release_date": null,
    "release_date_text": "1998",
    "cover_image_path": "https://i.scdn.co/image/ab67616d0000b273bb60df2a087112b4612b90ed",
    "spotify_url": "https://open.spotify.com/album/0SvOTFyoGbt9WThgEP75BF",
    "external_url": null,
    "source_url": "https://open.spotify.com/artist/0tQhg109ySNXCC0g7Xzivu",
    "tracks": [
      {
        "sequence_no": 1,
        "title": "Manolito Gil",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/2PgL0W1yNsdM7OzN4k9RGc",
        "notes": null
      },
      {
        "sequence_no": 2,
        "title": "Manuel Torres",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/1dmKZ89UJHmIBWrQGzR1Yd",
        "notes": null
      },
      {
        "sequence_no": 3,
        "title": "Domingo Romero",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/2MvFpkgdhVEpxObnh9zdBI",
        "notes": null
      },
      {
        "sequence_no": 4,
        "title": "Amigos de la Música",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/4KXnjjBrHM9n7Qf94wQaHf",
        "notes": null
      },
      {
        "sequence_no": 5,
        "title": "Paco Ojeda",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/554UU64LvsD70dGxntMapg",
        "notes": null
      },
      {
        "sequence_no": 6,
        "title": "Gallito",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/3iap9hWUkZUtSJoFhe9Ev2",
        "notes": null
      },
      {
        "sequence_no": 7,
        "title": "Fulgencio Morón",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/32bqSVI4qvzHrVrSTJt5NO",
        "notes": null
      },
      {
        "sequence_no": 8,
        "title": "Manolete",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/1XoPL9PlzPdeCUH4a3bn0W",
        "notes": null
      },
      {
        "sequence_no": 9,
        "title": "Agüero",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/7eaxLX96YYxTKpqT27Sq6n",
        "notes": null
      },
      {
        "sequence_no": 10,
        "title": "En Er Mundo",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/3WfCuIhYjLkl07sbhjIfBE",
        "notes": null
      },
      {
        "sequence_no": 11,
        "title": "Domingo Ortega",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/4z6MjkKeZgm1LTbdtm784p",
        "notes": null
      },
      {
        "sequence_no": 12,
        "title": "Opera Flamenca",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/2H71roOflvZdPYOAjwH6Fw",
        "notes": null
      }
    ]
  },
  {
    "band_slug": "banda-municipal-musica-gerena",
    "title": "Semana Santa en Gerena",
    "release_type": "album",
    "release_year": 1992,
    "release_date": null,
    "release_date_text": "1992",
    "cover_image_path": "https://i.scdn.co/image/ab67616d0000b273669fd468e8356fef7aff7fb7",
    "spotify_url": "https://open.spotify.com/album/4mANUPUzwbChd7cAc04s7k",
    "external_url": null,
    "source_url": "https://open.spotify.com/artist/0tQhg109ySNXCC0g7Xzivu",
    "tracks": [
      {
        "sequence_no": 1,
        "title": "Aniversario Macareno",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/6yEdGuMH6y34JvKYA9yLWg",
        "notes": null
      },
      {
        "sequence_no": 2,
        "title": "Macarena",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/1RbllAK74i2MTtBT34Qreq",
        "notes": null
      },
      {
        "sequence_no": 3,
        "title": "La Madrugá",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/4LvtNiPMH4GiwEQ2OTMchz",
        "notes": null
      },
      {
        "sequence_no": 4,
        "title": "Virgen de la Sangre",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/6PzWdasl4d1jxzR5VZX23t",
        "notes": null
      },
      {
        "sequence_no": 5,
        "title": "Pasa la Virgen de la Soledad",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/3m5bVgyVMbK9fq4c8A8XBc",
        "notes": null
      },
      {
        "sequence_no": 6,
        "title": "La Quinta Angustia",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/2ZXT1rskkoRxhtl0yoXZc3",
        "notes": null
      },
      {
        "sequence_no": 7,
        "title": "Pasa el Gran Poder",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/6hczo5hArPpcE6CQymK38R",
        "notes": null
      },
      {
        "sequence_no": 8,
        "title": "Virgen del Mayor Dolor",
        "duration_text": null,
        "spotify_url": "https://open.spotify.com/track/5yis8ybyRfN3kM4PR4Rmpm",
        "notes": null
      }
    ]
  },
  {
    "band_slug": "banda-musica-rosario-sanlucar-la-mayor",
    "title": "Nuestra Pasión",
    "release_type": "album",
    "release_year": 2023,
    "release_date": "2023-01-28",
    "release_date_text": "28/01/2023",
    "cover_image_path": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b9/81/94/b98194c2-f8ce-805b-36bc-1b101c9bfb93/artwork.jpg/1200x1200bb.jpg",
    "spotify_url": null,
    "external_url": "https://music.apple.com/us/album/nuestra-pasi%C3%B3n/1753169977?uo=4",
    "source_url": "https://music.apple.com/us/artist/bm-rosario-sanl%C3%BAcar-la-mayor/1752862642",
    "tracks": [
      {
        "sequence_no": 1,
        "title": "Pregonando nuestra pasión",
        "duration_text": "2:45",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/pregonando-nuestra-pasi%C3%B3n/1753169977?i=1753169978&uo=4"
      },
      {
        "sequence_no": 2,
        "title": "Salve, Madre de Alcosa",
        "duration_text": "4:46",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/salve-madre-de-alcosa/1753169977?i=1753169979&uo=4"
      },
      {
        "sequence_no": 3,
        "title": "Pax Aeterna",
        "duration_text": "5:02",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/pax-aeterna/1753169977?i=1753169980&uo=4"
      },
      {
        "sequence_no": 4,
        "title": "La Concepcion de María",
        "duration_text": "5:10",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/la-concepcion-de-mar%C3%ADa/1753169977?i=1753169982&uo=4"
      },
      {
        "sequence_no": 5,
        "title": "Madrugá de Angustias",
        "duration_text": "5:11",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/madrug%C3%A1-de-angustias/1753169977?i=1753169984&uo=4"
      },
      {
        "sequence_no": 6,
        "title": "Excelsa Amargura",
        "duration_text": "3:35",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/excelsa-amargura/1753169977?i=1753169985&uo=4"
      },
      {
        "sequence_no": 7,
        "title": "La escogida de Dios",
        "duration_text": "5:23",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/la-escogida-de-dios/1753169977?i=1753169986&uo=4"
      },
      {
        "sequence_no": 8,
        "title": "Triana",
        "duration_text": "4:48",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/triana/1753169977?i=1753169987&uo=4"
      },
      {
        "sequence_no": 9,
        "title": "La Concepción de María",
        "duration_text": "4:38",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/la-concepci%C3%B3n-de-mar%C3%ADa/1753169977?i=1753170049&uo=4"
      },
      {
        "sequence_no": 10,
        "title": "Rosario de Santa María",
        "duration_text": "3:36",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/rosario-de-santa-mar%C3%ADa/1753169977?i=1753170051&uo=4"
      },
      {
        "sequence_no": 11,
        "title": "Compañera de mi vida",
        "duration_text": "3:46",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/compa%C3%B1era-de-mi-vida/1753169977?i=1753170052&uo=4"
      },
      {
        "sequence_no": 12,
        "title": "Himno a Nuestra Señora de la Soledad (Coral)",
        "duration_text": "3:00",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/himno-a-nuestra-se%C3%B1ora-de-la-soledad-coral/1753169977?i=1753170053&uo=4"
      },
      {
        "sequence_no": 13,
        "title": "Himno a Nuestra Señora de la Soledad (Instrumental)",
        "duration_text": "2:59",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/himno-a-nuestra-se%C3%B1ora-de-la-soledad-instrumental/1753169977?i=1753170055&uo=4"
      },
      {
        "sequence_no": 14,
        "title": "Montserrat",
        "duration_text": "4:19",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/montserrat/1753169977?i=1753170056&uo=4"
      },
      {
        "sequence_no": 15,
        "title": "Sección Percusión-Paso Lento",
        "duration_text": "3:32",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/secci%C3%B3n-percusi%C3%B3n-paso-lento/1753169977?i=1753170057&uo=4"
      }
    ]
  },
  {
    "band_slug": "banda-musica-rosario-sanlucar-la-mayor",
    "title": "Concierto 110 Aniversario",
    "release_type": "album",
    "release_year": 2023,
    "release_date": "2023-03-12",
    "release_date_text": "12/03/2023",
    "cover_image_path": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/68/83/8f/68838f07-cca5-9c73-7230-837a3c6b4967/artwork.jpg/1200x1200bb.jpg",
    "spotify_url": null,
    "external_url": "https://music.apple.com/us/album/concierto-110-aniversario/1753212011?uo=4",
    "source_url": "https://music.apple.com/us/artist/bm-rosario-sanl%C3%BAcar-la-mayor/1752862642",
    "tracks": [
      {
        "sequence_no": 1,
        "title": "Cristo de la Vera Cruz",
        "duration_text": "4:45",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/cristo-de-la-vera-cruz/1753212011?i=1753212012&uo=4"
      },
      {
        "sequence_no": 2,
        "title": "Hosanna in Excelsis",
        "duration_text": "4:07",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/hosanna-in-excelsis/1753212011?i=1753212013&uo=4"
      },
      {
        "sequence_no": 3,
        "title": "Nuestra Señora del Patrocinio",
        "duration_text": "6:30",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/nuestra-se%C3%B1ora-del-patrocinio/1753212011?i=1753212014&uo=4"
      },
      {
        "sequence_no": 4,
        "title": "La Esperanza de Triana",
        "duration_text": "4:25",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/la-esperanza-de-triana/1753212011?i=1753212015&uo=4"
      },
      {
        "sequence_no": 5,
        "title": "Excelsa Amargura",
        "duration_text": "3:27",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/excelsa-amargura/1753212011?i=1753212016&uo=4"
      },
      {
        "sequence_no": 6,
        "title": "Procesión de Semana Santa en Sevilla",
        "duration_text": "7:09",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/procesi%C3%B3n-de-semana-santa-en-sevilla/1753212011?i=1753212017&uo=4"
      },
      {
        "sequence_no": 7,
        "title": "El Cachorro (Saeta Sevillana)",
        "duration_text": "6:25",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/el-cachorro-saeta-sevillana/1753212011?i=1753212259&uo=4"
      },
      {
        "sequence_no": 8,
        "title": "Valle de Sevilla",
        "duration_text": "5:09",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/valle-de-sevilla/1753212011?i=1753212260&uo=4"
      },
      {
        "sequence_no": 9,
        "title": "Esperanza Macarena",
        "duration_text": "3:26",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/esperanza-macarena/1753212011?i=1753212261&uo=4"
      },
      {
        "sequence_no": 10,
        "title": "La Madrugá",
        "duration_text": "7:19",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/la-madrug%C3%A1/1753212011?i=1753212264&uo=4"
      }
    ]
  },
  {
    "band_slug": "banda-musica-rosario-sanlucar-la-mayor",
    "title": "El Costumbrismo en la Música Sacra",
    "release_type": "album",
    "release_year": 2024,
    "release_date": "2024-05-03",
    "release_date_text": "03/05/2024",
    "cover_image_path": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a2/0d/d5/a20dd5c6-6b4b-2cf0-7a84-1fa2d74003ea/artwork.jpg/1200x1200bb.jpg",
    "spotify_url": null,
    "external_url": "https://music.apple.com/us/album/el-costumbrismo-en-la-m%C3%BAsica-sacra/1755477376?uo=4",
    "source_url": "https://music.apple.com/us/artist/bm-rosario-sanl%C3%BAcar-la-mayor/1752862642",
    "tracks": [
      {
        "sequence_no": 1,
        "title": "Saeta a Jesús de la Redención",
        "duration_text": "4:20",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/saeta-a-jes%C3%BAs-de-la-redenci%C3%B3n/1755477376?i=1755477378&uo=4"
      },
      {
        "sequence_no": 2,
        "title": "Soleá, dame la mano",
        "duration_text": "6:00",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/sole%C3%A1-dame-la-mano/1755477376?i=1755477559&uo=4"
      },
      {
        "sequence_no": 3,
        "title": "A orillas del Genil",
        "duration_text": "4:32",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/a-orillas-del-genil/1755477376?i=1755477560&uo=4"
      },
      {
        "sequence_no": 4,
        "title": "Triana, tu Esperanza",
        "duration_text": "4:59",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/triana-tu-esperanza/1755477376?i=1755477561&uo=4"
      },
      {
        "sequence_no": 5,
        "title": "Pasan los Campanilleros",
        "duration_text": "4:32",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/pasan-los-campanilleros/1755477376?i=1755477562&uo=4"
      },
      {
        "sequence_no": 6,
        "title": "Tras tu verde manto",
        "duration_text": "4:50",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/tras-tu-verde-manto/1755477376?i=1755477563&uo=4"
      },
      {
        "sequence_no": 7,
        "title": "Una saeta al cielo",
        "duration_text": "4:20",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/una-saeta-al-cielo/1755477376?i=1755477565&uo=4"
      },
      {
        "sequence_no": 8,
        "title": "Saeta en forma de salve a la Virgen de la Esperanza",
        "duration_text": "2:57",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/saeta-en-forma-de-salve-a-la-virgen-de-la-esperanza/1755477376?i=1755477567&uo=4"
      },
      {
        "sequence_no": 9,
        "title": "Rocío",
        "duration_text": "5:48",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/roc%C3%ADo/1755477376?i=1755477568&uo=4"
      },
      {
        "sequence_no": 10,
        "title": "Himno Nacional de España",
        "duration_text": "0:36",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/himno-nacional-de-espa%C3%B1a/1755477376?i=1755477569&uo=4"
      }
    ]
  },
  {
    "band_slug": "banda-musica-rosario-sanlucar-la-mayor",
    "title": "Angustias Gitana",
    "release_type": "album",
    "release_year": 1996,
    "release_date": "1996-01-14",
    "release_date_text": "14/01/1996",
    "cover_image_path": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/44/0e/2b/440e2b52-52af-714c-c73d-58207b5f7277/artwork.jpg/1200x1200bb.jpg",
    "spotify_url": null,
    "external_url": "https://music.apple.com/us/album/angustias-gitana/1753411708?uo=4",
    "source_url": "https://music.apple.com/us/artist/bm-rosario-sanl%C3%BAcar-la-mayor/1752862642",
    "tracks": [
      {
        "sequence_no": 1,
        "title": "Entre Sayones",
        "duration_text": "4:15",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/entre-sayones/1753411708?i=1753411711&uo=4"
      },
      {
        "sequence_no": 2,
        "title": "La Oración de una Virgen",
        "duration_text": "5:44",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/la-oraci%C3%B3n-de-una-virgen/1753411708?i=1753411714&uo=4"
      },
      {
        "sequence_no": 3,
        "title": "Mater Lacrimosa",
        "duration_text": "4:16",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/mater-lacrimosa/1753411708?i=1753411715&uo=4"
      },
      {
        "sequence_no": 4,
        "title": "Angustias Gitana",
        "duration_text": "7:07",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/angustias-gitana/1753411708?i=1753411716&uo=4"
      },
      {
        "sequence_no": 5,
        "title": "Regina Pacis",
        "duration_text": "5:08",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/regina-pacis/1753411708?i=1753411717&uo=4"
      },
      {
        "sequence_no": 6,
        "title": "Soleá, Sanlúcar te llora",
        "duration_text": "7:51",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/sole%C3%A1-sanl%C3%BAcar-te-llora/1753411708?i=1753411719&uo=4"
      },
      {
        "sequence_no": 7,
        "title": "Cristo de la Vera Cruz",
        "duration_text": "5:15",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/cristo-de-la-vera-cruz/1753411708?i=1753411720&uo=4"
      },
      {
        "sequence_no": 8,
        "title": "Marcha de Procesión N.º3",
        "duration_text": "3:32",
        "spotify_url": null,
        "notes": "Apple Music: https://music.apple.com/us/album/marcha-de-procesi%C3%B3n-n-%C2%BA3/1753411708?i=1753411721&uo=4"
      }
    ]
  }
]'::jsonb;
begin
  select id into v_gerena
  from public.entities
  where slug = 'banda-municipal-musica-gerena'
    and entity_type = 'band'
    and status = 'published';

  select id into v_rosario
  from public.entities
  where slug = 'banda-musica-rosario-sanlucar-la-mayor'
    and entity_type = 'band'
    and status = 'published';

  if v_gerena is null or v_rosario is null then
    raise exception 'D-02C: no se han localizado las dos entidades canónicas publicadas';
  end if;

  insert into public.sources (name, url, source_type, author_or_publisher, accessed_at, notes)
  select source.name, source.url, source.source_type, source.publisher, date '2026-09-21', source.notes
  from (values
    ('Banda Municipal de Música de Gerena · Spotify oficial', 'https://open.spotify.com/artist/0tQhg109ySNXCC0g7Xzivu', 'music_platform', 'Spotify', 'Perfil oficial y catálogo discográfico canónico de la formación.'),
    ('Banda del Rosario de Sanlúcar la Mayor · web oficial', 'https://elrosariodesanlucar.com/', 'official_website', 'Banda de Música Ntra. Sra. del Rosario', 'Fuente institucional para identidad, localidad, antigüedad y continuidad de la formación.'),
    ('Banda del Rosario de Sanlúcar la Mayor · Spotify oficial', 'https://open.spotify.com/artist/42adDBkCNRNr3natyIjrNt', 'music_platform', 'Spotify', 'Perfil oficial histórico de la formación; sus dos pistas visibles pertenecen a una recopilación de varios artistas y no se duplican como edición propia.'),
    ('BM Rosario Sanlúcar La Mayor · Spotify catálogo', 'https://open.spotify.com/artist/7jpxg8y1TvdhvjFL33EGOr', 'music_platform', 'Spotify', 'Segundo perfil editorial reconciliado con la misma formación por denominación, localidad y repertorio.'),
    ('BM Rosario Sanlúcar La Mayor · Apple Music', 'https://music.apple.com/us/artist/bm-rosario-sanl%C3%BAcar-la-mayor/1752862642', 'music_platform', 'Apple Music', 'Catálogo estable usado para fechas, carátulas, repertorios y duraciones de las cuatro ediciones propias.')
  ) as source(name, url, source_type, publisher, notes)
  where not exists (select 1 from public.sources existing where existing.url = source.url);

  update public.sources
  set accessed_at = date '2026-09-21'
  where url in (
    'https://open.spotify.com/artist/0tQhg109ySNXCC0g7Xzivu',
    'https://elrosariodesanlucar.com/',
    'https://open.spotify.com/artist/42adDBkCNRNr3natyIjrNt',
    'https://open.spotify.com/artist/7jpxg8y1TvdhvjFL33EGOr',
    'https://music.apple.com/us/artist/bm-rosario-sanl%C3%BAcar-la-mayor/1752862642'
  );

  select id into v_gerena_source from public.sources
  where url = 'https://open.spotify.com/artist/0tQhg109ySNXCC0g7Xzivu'
  order by created_at limit 1;

  select id into v_rosario_apple_source from public.sources
  where url = 'https://music.apple.com/us/artist/bm-rosario-sanl%C3%BAcar-la-mayor/1752862642'
  order by created_at limit 1;

  insert into public.source_links (source_id, entity_id, scope, notes)
  select source.id, target.entity_id, target.scope, target.notes
  from (values
    ('https://open.spotify.com/artist/0tQhg109ySNXCC0g7Xzivu', v_gerena, 'Discografía oficial', 'Identidad editorial, ediciones, carátulas y repertorios.'),
    ('https://elrosariodesanlucar.com/', v_rosario, 'Identidad institucional', 'Acredita que la formación de Sanlúcar la Mayor fundada en 1913 es una única realidad institucional.'),
    ('https://open.spotify.com/artist/42adDBkCNRNr3natyIjrNt', v_rosario, 'Perfil oficial histórico', 'Perfil con biografía oficial y apariciones en recopilatorios; no genera ediciones propias adicionales.'),
    ('https://open.spotify.com/artist/7jpxg8y1TvdhvjFL33EGOr', v_rosario, 'Perfil editorial reconciliado', 'Perfil que agrupa las ediciones propias de la misma formación.'),
    ('https://music.apple.com/us/artist/bm-rosario-sanl%C3%BAcar-la-mayor/1752862642', v_rosario, 'Discografía oficial', 'Metadatos de las cuatro ediciones propias, incluidas pistas y duraciones.')
  ) as target(url, entity_id, scope, notes)
  join public.sources source on source.url = target.url
  where not exists (
    select 1 from public.source_links existing
    where existing.source_id = source.id and existing.entity_id = target.entity_id
  );

  insert into public.entity_social_links (entity_id, platform, url, label, display_order, is_public)
  values
    (v_gerena, 'spotify', 'https://open.spotify.com/artist/0tQhg109ySNXCC0g7Xzivu', 'Spotify', 40, true),
    (v_rosario, 'website', 'https://elrosariodesanlucar.com/', 'Web oficial', 10, true),
    (v_rosario, 'spotify', 'https://open.spotify.com/artist/7jpxg8y1TvdhvjFL33EGOr', 'Spotify · catálogo', 40, true)
  on conflict (entity_id, platform) do update set
    url = excluded.url,
    label = excluded.label,
    display_order = excluded.display_order,
    is_public = excluded.is_public,
    updated_at = now();

  insert into public.band_releases (
    band_entity_id, title, release_type, release_year, release_date,
    release_date_text, description, cover_image_path, cover_image_alt,
    cover_image_credit, spotify_url, external_url, status
  )
  select
    case release.band_slug when 'banda-municipal-musica-gerena' then v_gerena else v_rosario end,
    release.title,
    release.release_type,
    release.release_year,
    release.release_date,
    release.release_date_text,
    'Edición propia verificada en el catálogo digital oficial de la formación.',
    release.cover_image_path,
    'Carátula de «' || release.title || '»',
    case when release.band_slug = 'banda-municipal-musica-gerena' then 'Carátula editorial · Spotify' else 'Carátula editorial · Apple Music' end,
    release.spotify_url,
    release.external_url,
    'published'
  from jsonb_to_recordset(v_catalog) as release(
    band_slug text, title text, release_type text, release_year integer,
    release_date date, release_date_text text, cover_image_path text,
    spotify_url text, external_url text, source_url text, tracks jsonb
  )
  on conflict (band_entity_id, title, release_year) do update set
    release_type = excluded.release_type,
    release_date = excluded.release_date,
    release_date_text = excluded.release_date_text,
    description = excluded.description,
    cover_image_path = excluded.cover_image_path,
    cover_image_alt = excluded.cover_image_alt,
    cover_image_credit = excluded.cover_image_credit,
    spotify_url = excluded.spotify_url,
    external_url = excluded.external_url,
    status = excluded.status,
    updated_at = now();

  insert into public.band_release_tracks (release_id, sequence_no, title, duration_text, notes, spotify_url)
  select edition.id, track.sequence_no, track.title, track.duration_text, track.notes, track.spotify_url
  from jsonb_to_recordset(v_catalog) as release(
    band_slug text, title text, release_type text, release_year integer,
    release_date date, release_date_text text, cover_image_path text,
    spotify_url text, external_url text, source_url text, tracks jsonb
  )
  join public.band_releases edition
    on edition.band_entity_id = case release.band_slug when 'banda-municipal-musica-gerena' then v_gerena else v_rosario end
   and edition.title = release.title
   and edition.release_year = release.release_year
  cross join lateral jsonb_to_recordset(release.tracks) as track(
    sequence_no integer, title text, duration_text text, notes text, spotify_url text
  )
  on conflict (release_id, sequence_no) do update set
    title = excluded.title,
    duration_text = excluded.duration_text,
    notes = excluded.notes,
    spotify_url = excluded.spotify_url;

  insert into public.band_release_sources (release_id, source_id, scope)
  select edition.id,
         case release.band_slug when 'banda-municipal-musica-gerena' then v_gerena_source else v_rosario_apple_source end,
         'Edición, carátula y repertorio'
  from jsonb_to_recordset(v_catalog) as release(
    band_slug text, title text, release_year integer
  )
  join public.band_releases edition
    on edition.band_entity_id = case release.band_slug when 'banda-municipal-musica-gerena' then v_gerena else v_rosario end
   and edition.title = release.title
   and edition.release_year = release.release_year
  on conflict (release_id, source_id) do update set scope = excluded.scope;

  if (select count(*) from public.band_releases where band_entity_id = v_gerena and status = 'published') <> 14
     or (select count(*) from public.band_release_tracks track join public.band_releases release on release.id = track.release_id where release.band_entity_id = v_gerena) <> 73 then
    raise exception 'D-02C: Gerena no cierra en 14 ediciones / 73 pistas';
  end if;

  if (select count(*) from public.band_releases where band_entity_id = v_rosario and status = 'published') <> 4
     or (select count(*) from public.band_release_tracks track join public.band_releases release on release.id = track.release_id where release.band_entity_id = v_rosario) <> 43 then
    raise exception 'D-02C: Rosario no cierra en 4 ediciones / 43 pistas';
  end if;

  if exists (
    select 1 from public.band_releases release
    where release.band_entity_id in (v_gerena, v_rosario)
      and (release.cover_image_path is null or release.cover_image_path = '')
  ) then
    raise exception 'D-02C: existe una edición sin carátula';
  end if;

  if (select count(*) from public.band_releases where band_entity_id in (v_gerena, v_rosario)) <> 18
     or (select count(*) from public.band_release_tracks track join public.band_releases release on release.id = track.release_id where release.band_entity_id in (v_gerena, v_rosario)) <> 116 then
    raise exception 'D-02C: el lote no cierra en 18 ediciones / 116 pistas';
  end if;
end $$;
