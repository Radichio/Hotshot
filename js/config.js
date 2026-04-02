const SITE_CONFIG = {

  // ── BUSINESS INFO ──
  business: {
    name: "Hot Shot Entertainment",
    owner: "Cory Gulenchin",
    title: "WPICC DJ/MC — Certified Wedding Coordinator",
    phone: "204-648-4747",
    phoneLink: "tel:+12046484747",
    email: "cory@hotshotent.com",
    region: "Parkland & Interlake, Manitoba",
    tagline: "Making Every Event Hit the Mark",
    copyright: `© ${new Date().getFullYear()} Hot Shot Entertainment`,
    social: {
      facebook: "https://facebook.com/hotshotentertainment",
      instagram: "",
    }
  },

  // ── TESTIMONIALS ──
  // To add more: copy one block, paste below, update quote/attribution/detail
  testimonials: [
    {
      shortQuote: "Your presence truly brought the entire celebration to life. It's rare to find someone who can bring so much heart and professionalism to a role like yours — and you did it effortlessly.",
      fullQuote: "Cory, we just wanted to take a moment to send you our deepest thanks for the incredible job you did as the host, DJ, and Master of Ceremonies at Dylan & Ashley's wedding. Your presence truly brought the entire celebration to life. From helping plan the flow of the evening the day before, to seamlessly guiding the entire celebration, your professionalism, care and charisma shone through every step of the way. You took the time to understand the kids' vision and then brought it to life even better than we all could have imagined. From the moment the evening began, you set the perfect tone — warm, engaging, and full of energy. You had an amazing way of reading the room, knowing just when to turn up the excitement and when to pull back for those quiet, meaningful moments. Your timing was impeccable, your voice carried such ease and confidence, and your genuine enthusiasm made everyone feel like part of something truly special. Your smooth transitions between events kept everything flowing seamlessly. It's rare to find someone who can bring so much heart and professionalism to a role like yours — and you did it effortlessly. You didn't just help make the night unforgettable; you were a part of what made it unforgettable. Thank you for being such a key piece of a beautiful, joyful, once-in-a-lifetime day.",
      attribution: "Lorelle & Brad",
      detail: "Parents of the Groom — Dylan & Ashley's Wedding"
    },
  ],

  // ── BOOKED DATES ──
  // Format: "YYYY-MM-DD"
  // Add dates here as you book them — they will show as unavailable in the date checker
  bookedDates: [
    // "2026-07-19",
  ],
  holdDates: [
    // "2026-09-05",
  ],

  // ── PACKAGES ──
  // NOTE TO CORY: Review and confirm package names, prices, and features before launch
  packages: [
    {
      name: "The Social",
      price: "From $800",
      priceNote: "+ mileage & GST",
      description: "Perfect for dances, socials, fundraisers, and community events.",
      features: [
        "Professional sound system",
        "MC & host services",
        "Up to 5 hours",
        "Custom playlist planning"
      ],
      popular: false
    },
    {
      name: "The Celebration",
      price: "From $3,500",
      priceNote: "+ mileage & GST",
      description: "Full wedding reception coverage — your complete evening handled.",
      features: [
        "Planning consultation",
        "Ceremony audio",
        "Cocktail + dinner music",
        "Full dance set + MC",
        "Up to 10 hours"
      ],
      popular: true
    },
    {
      name: "The Full Experience",
      price: "Custom Quote",
      priceNote: "contact for details",
      description: "Everything in The Celebration, plus full-day coordination and premium add-ons.",
      features: [
        "Full-day coordination",
        "Uplighting package",
        "Large screen video",
        "Dedicated planning session",
        "Unlimited hours"
      ],
      popular: false
    }
  ],

  // ── SERVICES ──
  services: [
    {
      icon: "mic",
      title: "MC & Host",
      description: "More than announcements — I guide your evening with warmth, energy, and seamless coordination. From grand entrances to last call, every moment flows."
    },
    {
      icon: "music",
      title: "DJ Services",
      description: "50,000+ song library spanning every era and genre. Pro-grade sound that fills the room without drowning conversation. I read the crowd and keep the dance floor packed."
    },
    {
      icon: "ring",
      title: "Wedding Coordination",
      description: "WPICC certified. I work with you and your vendors to build a timeline, manage the flow, and handle the details so you can be present for every moment of your day."
    }
  ],

  // ── ENHANCEMENTS ──
  enhancements: [
    {
      title: "Uplighting",
      description: "Transform any venue with colour-washed walls that set the perfect mood.",
      image: "images/svc-uplighting.png"
    },
    {
      title: "Large Video Screening",
      description: "Bring the party to life with large-format video displays for slideshows and more.",
      image: "images/svc-video-screening.png"
    },
    {
      title: "Remote Onsite Setup",
      description: "Full professional DJ setup delivered and running at virtually any venue of your choice.",
      image: "images/svc-remote-setup.png"
    },
    {
      title: "Elegant Mood Lighting",
      description: "Warm, ambient lighting packages that elevate any space into something special.",
      image: "images/svc-mood-lighting.png"
    }
  ],

  // ── GALLERY ──
  // To add photos: { src: "images/your-photo.jpg", alt: "Description", category: "wedding" }
  // Categories: wedding, dj, lighting, setup
  gallery: [
    { src: "images/wedding-party.jpg", alt: "Wedding reception — bride and wedding party laughing at head table", category: "wedding" },
    { src: "images/hero-dj-tall.jpg", alt: "Cory Gulenchin DJing at a wedding reception", category: "dj" },
    { src: "images/wedding-party-cropped.jpg", alt: "Bride enjoying the reception", category: "wedding" },
    { src: "images/svc-uplighting.png", alt: "Purple uplighting at venue", category: "lighting" },
    { src: "images/svc-video-screening.png", alt: "Large screen video setup for events", category: "setup" },
    { src: "images/svc-mood-lighting.png", alt: "Elegant mood lighting for events", category: "lighting" },
  ],

  // ── FAQ ──
  // NOTE TO CORY: Review these — adjust any answers to match exactly how you'd say it
  faq: [
    {
      q: "How far do you travel?",
      a: "I'm based in the Parkland region and regularly serve the entire Interlake area of Manitoba. Mileage is added for events outside my base area. Just ask — I love a road trip for a great party."
    },
    {
      q: "What equipment do you bring?",
      a: "I arrive fully self-contained with professional sound system, wireless microphones, DJ controller, laptop with 50,000+ song library, and backup equipment for everything critical. Uplighting, large screen video, and mood lighting available as add-ons."
    },
    {
      q: "What if we need to postpone?",
      a: "Life happens. I work with my couples to find a new date that works for everyone. Your deposit transfers to the new date."
    },
    {
      q: "Do you take requests during the event?",
      a: "Absolutely — within reason. I read the room and blend requests with the flow of the night. You can also provide a Do Not Play list in advance."
    },
    {
      q: "What makes you different from a playlist?",
      a: "A playlist can't read the room, adjust the energy, introduce your wedding party, coordinate your timeline, or save the moment when the best man's mic cuts out. I'm not just pressing play — I'm your MC, your coordinator, and your insurance policy for a seamless night."
    },
    {
      q: "Are you insured?",
      a: "Yes, fully insured for all events."
    }
  ]

};
