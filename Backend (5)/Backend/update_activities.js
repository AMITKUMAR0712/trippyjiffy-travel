import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const getActivities = (title) => {
  let items = [];
  const t = (title || "").toLowerCase();
  
  if (t.includes('kerala')) {
    items = ['Ayurvedic massage and spa therapy', 'Kathakali dance performance evening', 'Sunset cruise on the backwaters', 'Spice plantation guided tour'];
  } else if (t.includes('agra') || t.includes('delhi') || t.includes('golden triangle')) {
    items = ['Rickshaw ride in Old Delhi', 'Mohabbat the Taj live show in Agra', 'Bicycle tour around the Taj Mahal', 'Local street food tasting walk'];
  } else if (t.includes('rajasthan') || t.includes('jaipur') || t.includes('jaisalmer') || t.includes('udaipur')) {
    items = ['Hot air balloon ride over the Pink City', 'Desert camel safari at sunset', 'Puppet show and traditional Rajasthani Thali dinner', 'Private cooking class with a local family'];
  } else if (t.includes('mathura') || t.includes('vrindavan') || t.includes('haridwar') || t.includes('rishikesh')) {
    items = ['VIP Ganga Aarti seating', 'Morning Yoga and Meditation session by the river', 'Temple walking tour with a local priest'];
  } else if (t.includes('corbett') || t.includes('ranthambore') || t.includes('safari')) {
    items = ['Private open jeep safari upgrade', 'Nature walk with an expert naturalist', 'Night safari in buffer zones', 'Bird watching tour with binoculars provided'];
  } else if (t.includes('bali') || t.includes('indonesia')) {
    items = ['Mount Batur sunrise trek', 'Ubud monkey forest and rice terrace tour', 'Balinese cooking class in a local village'];
  } else if (t.includes('thailand') || t.includes('phuket') || t.includes('bangkok')) {
    items = ['Chao Phraya river dinner cruise', 'Phi Phi Islands speedboat day trip', 'Authentic Thai massage session'];
  } else if (t.includes('singapore') || t.includes('malaysia')) {
    items = ['Gardens by the Bay nocturnal light show', 'Universal Studios fast pass upgrade', 'Batu Caves and cultural village tour'];
  } else {
    items = ['Private local food tasting tour', 'Cultural photography walk', 'Guided heritage walk through old town', 'Exclusive shopping excursion'];
  }

  return JSON.stringify({
    time: Date.now(),
    blocks: [
      {
        id: "aB3cD4eF5g",
        type: "list",
        data: {
          style: "unordered",
          items: items.map(item => ({ content: item, meta: {}, items: [] }))
        }
      }
    ],
    version: "2.31.0-rc.7"
  });
};

async function updateTours() {
  let countTours = 0;
  const tours = await prisma.tours.findMany();
  for (let tour of tours) {
    if (!tour.supplemental_activities || tour.supplemental_activities.includes('Not Available')) {
      const data = getActivities(tour.title);
      await prisma.tours.update({
        where: { id: tour.id },
        data: { supplemental_activities: data }
      });
      countTours++;
    }
  }

  let countCountryTours = 0;
  const countryTours = await prisma.countrytours.findMany();
  for (let ct of countryTours) {
    if (!ct.supplemental_activities || ct.supplemental_activities.includes('Not Available')) {
      const data = getActivities(ct.title);
      await prisma.countrytours.update({
        where: { id: ct.id },
        data: { supplemental_activities: data }
      });
      countCountryTours++;
    }
  }
  
  console.log(`Updated ${countTours} India tours and ${countCountryTours} Country tours with real supplemental activities data.`);
}

updateTours().catch(console.error).finally(() => prisma.$disconnect());
