export const soundposts = [
    {
      id: "01b56ef0-4345-11ed-b878-0242ac120002",
      account: "The Night Sky",
      title: "Eternal Light",
      description: "life goes on",
      duration: "3:45",
      date: "2023-05-20T00:00:00",
      listened: true,
      channels: ["Ambient", "Chillwave"],
      deployed: false,
    },
    {
      id: "02d92b12-4345-11ed-b878-0242ac120002",
      account: "Solar Waves",
      title: "Ocean Drive",
      description: "life goes on",
      duration: "4:12",
      date: "2023-06-15T00:00:00",
      listened: false,
      channels: ["Synthwave", "Electronica"],
      deployed: true,
    },
    {
      id: "03f27b8a-4345-11ed-b878-0242ac120002",
      account: "Echoes of Tomorrow",
      title: "Through Time",
      description: "life goes on",
      duration: "5:08",
      date: "2023-07-22T00:00:00",
      listened: false,
      channels: ["Progressive Rock", "Space Rock"],
      deployed: true,
    },
    {
      id: "0518d8e2-4345-11ed-b878-0242ac120002",
      account: "Lunar Phases",
      title: "Shadow Dance",
      description: "life goes on",
      duration: "4:33",
      date: "2023-08-30T00:00:00",
      listened: true,
      channels: ["Indie Pop", "Electropop"],
      deployed: false,
    },
    {
      id: "0659ea1a-4345-11ed-b878-0242ac120002",
      account: "Aurora Borealis",
      title: "Night Lights",
      description: "life goes on",
      duration: "3:58",
      date: "2023-09-14T00:00:00",
      listened: true,
      channels: ["New Age", "Ambient"],
      deployed: false,
    },
  ];
  
export type SoundPost = (typeof soundposts)[number]

export const accounts = [
  {
    name: "Emma Johnson",
    email: "emma.johnson@example.com",
  },
  {
    name: "Liam Wilson",
    email: "liam.wilson@example.com",
  },
  {
    name: "Olivia Davis",
    email: "olivia.davis@example.com",
  },
  {
    name: "Noah Martinez",
    email: "noah.martinez@example.com",
  },
  {
    name: "Ava Taylor",
    email: "ava.taylor@example.com",
  },
  {
    name: "Lucas Brown",
    email: "lucas.brown@example.com",
  },
  {
    name: "Sophia Smith",
    email: "sophia.smith@example.com",
  },
  {
    name: "Ethan Wilson",
    email: "ethan.wilson@example.com",
  },
  {
    name: "Isabella Jackson",
    email: "isabella.jackson@example.com",
  },
  {
    name: "Mia Clark",
    email: "mia.clark@example.com",
  },
  {
    name: "Mason Lee",
    email: "mason.lee@example.com",
  },
  {
    name: "Layla Harris",
    email: "layla.harris@example.com",
  },
  {
    name: "William Anderson",
    email: "william.anderson@example.com",
  },
  {
    name: "Ella White",
    email: "ella.white@example.com",
  },
  {
    name: "James Thomas",
    email: "james.thomas@example.com",
  },
  {
    name: "Harper Lewis",
    email: "harper.lewis@example.com",
  },
  {
    name: "Benjamin Moore",
    email: "benjamin.moore@example.com",
  },
  {
    name: "Aria Hall",
    email: "aria.hall@example.com",
  },
  {
    name: "Henry Turner",
    email: "henry.turner@example.com",
  },
  {
    name: "Scarlett Adams",
    email: "scarlett.adams@example.com",
  },
]

export type Account = (typeof accounts)[number]