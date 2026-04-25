const mechanics = [
  {
    name: "Raju Auto Garage",
    email: "raju@auto.com",
    phone: "9876543210",
    password: "123456",
    skills: ["Engine", "Tyre", "Battery"],
    experience: 5,
    isApproved: true,
    isOnline: true,
    location: {
      type: "Point",
      coordinates: [73.8567, 18.5204], // Pune
    },
    rating: 4.5,
    totalJobs: 120,
  },

  {
    name: "SpeedFix Mechanics",
    email: "speedfix@auto.com",
    phone: "9876501234",
    password: "123456",
    skills: ["Towing", "AC Repair", "Engine"],
    experience: 7,
    isApproved: true,
    isOnline: false,
    location: {
      type: "Point",
      coordinates: [73.8600, 18.5300],
    },
    rating: 4.2,
    totalJobs: 200,
  },

  {
    name: "QuickAssist Garage",
    email: "quick@auto.com",
    phone: "9876509999",
    password: "123456",
    skills: ["Battery", "Inspection", "Tyre"],
    experience: 3,
    isApproved: false,
    isOnline: true,
    location: {
      type: "Point",
      coordinates: [73.8450, 18.5150],
    },
    rating: 4.0,
    totalJobs: 80,
  },

  {
    name: "Metro Car Care",
    email: "metro@auto.com",
    phone: "9876507777",
    password: "123456",
    skills: ["Engine", "AC Repair"],
    experience: 10,
    isApproved: true,
    isOnline: true,
    location: {
      type: "Point",
      coordinates: [73.8700, 18.5400],
    },
    rating: 4.8,
    totalJobs: 350,
  },
];

module.exports = mechanics;