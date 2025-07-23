import { mutation, query, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";

/**
 * Helper function for structured logging
 * @param event The event name
 * @param data The event data
 */
function logEvent(event: string, data: Record<string, any>) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    event,
    ...data
  }));
}

// List all photos for the current session.
export const list = query({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const photos = await ctx.db
      .query("photos")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .collect();
    // Attach signed URLs for display
    return await Promise.all(
      photos.map(async (photo) => ({
        ...photo,
        url: await ctx.storage.getUrl(photo.storageId),
      }))
    );
  },
});

// Generate a short-lived upload URL for the client
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Save photo metadata after upload, schedule description generation
export const savePhoto = mutation({
  args: {
    storageId: v.id("_storage"),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const photoId = await ctx.db.insert("photos", {
      sessionId: args.sessionId,
      storageId: args.storageId,
      status: "pending",
    });
    
    logEvent("photo_upload_completed", { 
      photoId: photoId.toString(), 
      sessionId: args.sessionId, 
      storageId: args.storageId.toString() 
    });
    
    // Schedule the AI description action with a 2-second delay
    await ctx.scheduler.runAfter(2000, internal.photos_actions.describePhoto, { photoId });
    
    logEvent("photo_analysis_scheduled", { 
      photoId: photoId.toString(),
      delay: "2000ms"
    });
    
    return photoId;
  },
});

// Get a single photo (with signed URL) - for client, checks session
export const get = query({
  args: { 
    photoId: v.id("photos"),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const photo = await ctx.db.get(args.photoId);
    // Handle both new photos with sessionId and old photos with userId
    if (!photo) return null;
    
    // For new photos, check sessionId
    if (photo.sessionId && photo.sessionId !== args.sessionId) return null;
    
    // For old photos, allow access (they're already public)
    return {
      ...photo,
      url: await ctx.storage.getUrl(photo.storageId),
    };
  },
});

// Internal get: fetch photo by ID, no user check (for actions)
export const internalGet = internalQuery({
  args: { photoId: v.id("photos") },
  handler: async (ctx, args) => {
    logEvent("internal_photo_fetch", {
      photoId: args.photoId.toString(),
      operation: "internalGet"
    });
    
    const photo = await ctx.db.get(args.photoId);
    
    logEvent("internal_photo_fetch_result", {
      photoId: args.photoId.toString(),
      found: !!photo,
      status: photo?.status
    });
    
    return photo;
  },
});

// Set the description after AI completes
export const setDescription = mutation({
  args: {
    photoId: v.id("photos"),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.photoId, {
      description: args.description,
      status: "done",
      error: undefined,
    });
    
    logEvent("photo_analysis_completed", {
      photoId: args.photoId.toString(),
      descriptionLength: args.description.length,
      status: "done"
    });
  },
});

// Set error if AI fails
export const setError = mutation({
  args: {
    photoId: v.id("photos"),
    error: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.photoId, {
      status: "error",
      error: args.error,
    });
    
    logEvent("photo_analysis_error", {
      photoId: args.photoId.toString(),
      error: args.error,
      status: "error"
    });
  },
});

// Helper function to get a random element from an array
const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

// Helper function to parse CSV content and get a random entry
const getRandomEntryFromCSV = (csvContent: string) => {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  const data = lines.slice(1).map(line => {
    const values = line.split(',');
    const entry: { [key: string]: string } = {};
    headers.forEach((header, i) => {
      entry[header.trim()] = values[i] ? values[i].trim() : '';
    });
    return entry;
  });
  return getRandomElement(data);
};

export const getMadLibData = query({
  args: {},
  handler: async (ctx) => {
    // NOTE: In a production app, this data would ideally be stored in Convex tables
    // for more efficient querying rather than hardcoding CSV content here.
    const mormonFilmsCSV = `TITLE,YEAR,MPAA RATING,RUNTIME,WIKIPEDIA ENTRY
God's Army,2000,PG,118 min,Link
Brigham City,2001,PG-13,121 min,Link
The Other Side of Heaven,2001,PG,113 min,Link
The Singles Ward,2002,PG,104 min,Link
The R.M.,2003,PG,101 min,Link
Saints and Soldiers,2003,PG-13,90 min,Link
The Work and the Glory,2004,PG,118 min,Link
The Work and the Glory II: American Zion,2005,PG-13,101 min,Link
The Work and the Glory III: A House Divided,2006,PG,95 min,Link
17 Miracles,2011,PG,113 min,Link
Ephraim's Rescue,2013,PG,99 min,Link
The Cokeville Miracle,2015,PG-13,94 min,Link
Freetown,2015,PG-13,111 min,Link
Jane and Emma,2018,PG,91 min,Link
The Fighting Preacher,2019,PG,98 min,Link
The Best Two Years,2003,PG,102 min,Link
Saints and Soldiers: Airborne Creed,2012,PG-13,96 min,Link
The Saratov Approach,2013,PG-13,108 min,Link
Saints and Soldiers: The Void,2014,PG-13,91 min,Link
Once I Was a Beehive,2015,PG,119 min,Link
The Other Side of Heaven 2: Fire of Faith,2019,PG-13,117 min,Link
Once I Was Engaged,2021,PG,115 min,Link
Johnny Lingo (Short Film),1969,Not Rated,24 min,Link
The Phone Call (Short Film),1977,Not Rated,24 min,Link
Legacy: A Mormon Journey,1993,Not Rated,53 min,Link
The Testaments of One Fold and One Shepherd,2000,Not Rated,67 min,Link
Finding Faith in Christ,2003,Not Rated,28 min,Link
Joseph Smith: The Prophet of the Restoration,2005,Not Rated,69 min,Link
Meet the Mormons,2014,PG,78 min,Link`;

    const mormonMusicCSV = `TITLE,ARTIST,YEAR,RUNTIME,WIKIPEDIA ENTRY
We'll Bring the World His Truth,Janice Kapp Perry,1986,N/A,Artist Page
Greater Than Us All,Kenneth Cope,1989,43 min,Artist Page
The Forgotten Carols,Michael McLean,1991,48 min,Album Page
Women at the Well,various artists,1999,49 min,Label Page
My Beloved Christ,various artists,2000,45 min,Label Page
Jericho Road,Jericho Road,2001,49 min,Artist Page
He Hears Me,Hilary Weeks,2004,46 min,Artist Page
One Voice,Gladys Knight & the Saints Unified Voices,2005,55 min,Album Page
Every Step,Hilary Weeks,2011,45 min,Artist Page
Vocal Point,Vocal Point,2012,34 min,Artist Page
The Sound of Glory,Mormon Tabernacle Choir,1959,41 min,Artist Page
Spirit of America,Mormon Tabernacle Choir,2003,55 min,Discography
"Come, Thou Fount of Every Blessing",Mormon Tabernacle Choir,2009,71 min,Album Page
Messiah (Complete Oratorio),Mormon Tabernacle Choir,2016,140 min,Oratorio Page
Let Us All Press On: Hymns of Praise and Inspiration,The Tabernacle Choir at Temple Square,2019,63 min,Discography
EFY 1999: A Season for Courage,various artists,1999,46 min,Program Page
EFY 2004: Stand in Holy Places,various artists,2004,49 min,Program Page
EFY 2008: Steady and Sure,various artists,2008,51 min,Program Page
EFY 2013: Firm in the Faith,various artists,2013,49 min,Program Page
EFY 2019: If We Love Him,various artists,2019,42 min,Program Page
Saturday's Warrior,Original 1974 Cast,1974,48 min,Album Page
My Turn on Earth,Original 1977 Cast,1977,46 min,Album Page
The New Young Ambassadors,The Young Ambassadors,1972,N/A,Artist Page
Go My Son,The Lamanite Generation,1974,N/A,Artist Page
A Time for Joy,The Young Ambassadors,1976,N/A,Artist Page
An Airus Faire,Kurt Bestor,1987,37 min,Artist Page`;

    const mormonTVShowsCSV = `TITLE,NETWORK,INITIAL YEAR AIRED,GENRE,LINK TO WIKIPEDIA ENTRY
"The Chosen (Note: Not LDS-produced, but distributed by Angel Studios and aired on BYUtv)","Angel Studios, BYUtv",2019,Historical Drama,https://en.wikipedia.org/wiki/The_Chosen_(TV_series
Book of Mormon Videos,The Church of Jesus Christ,2019,Religious Drama / Web Series,https://en.wikipedia.org/wiki/Book_of_Mormon_Videos
Relative Race,BYUtv,2016,Reality Competition,https://en.wikipedia.org/wiki/Relative_Race
Random Acts,BYUtv,2015,Hidden Camera / Reality,https://en.wikipedia.org/wiki/Random_Acts_(TV_series
The Fixers,BYUtv,2016,Reality / Docuseries,https://en.wikipedia.org/wiki/The_Fixers_(2016_TV_series
Making Good,BYUtv,2019,Docuseries,https://en.wikipedia.org/wiki/Making_Good
All-Round Champion,"BYUtv, TVO",2020,Reality Competition,https://en.wikipedia.org/wiki/All-Round_Champion
Studio C,BYUtv,2012,Sketch Comedy,https://en.wikipedia.org/wiki/Studio_C
Granite Flats,BYUtv,2013,Drama / Mystery,https://en.wikipedia.org/wiki/Granite_Flats
Extinct,BYUtv,2017,Science Fiction / Drama,https://en.wikipedia.org/wiki/Extinct_(TV_series
Dwight in Shining Armor,BYUtv,2018,Fantasy / Comedy,https://en.wikipedia.org/wiki/Dwight_in_Shining_Armor
Show Offs,BYUtv,2019,Improv Comedy / Musical,https://en.wikipedia.org/wiki/Show_Offs
The Canterville Ghost,BYUtv,2021,Fantasy / Drama,https://en.wikipedia.org/wiki/The_Canterville_Ghost_(2021_TV_series
Music & the Spoken Word,"CBS Radio/TV, Syndication",1949,Music / Religious Broadcast,https://en.wikipedia.org/wiki/Music_and_the_Spoken_Word
General Conference,"The Church of Jesus Christ, BYUtv",1949,Religious Conference,https://en.wikipedia.org/wiki/General_Conference_(The_Church_of_Jesus_Christ_of_Latter-day_Saints
BYU Devotional,BYUtv,1960,Religious Address / Talk,https://speeches.byu.edu/`;

    const mormonFictionCSV = `TITLE,AUTHOR,YEAR RELEASED,HOW MANY PAGES,LINK TO WIKIPEDIA ENTRY
Tennis Shoes Among the Nephites,Chris Heimerdinger,1989,230,https://en.wikipedia.org/wiki/Tennis_Shoes_Among_the_Nephites
Escape from Zarahemla,Chris Heimerdinger,2007,352,https://en.wikipedia.org/wiki/Chris_Heimerdinger
Lemon Tart (A Culinary Mystery),Josi S. Kilpack,2009,291,https://en.wikipedia.org/wiki/Josi_S._Kilpack
The Alliance,Gerald N. Lund,2013,496,https://en.wikipedia.org/wiki/Gerald_N._Lund
Twilight,Stephenie Meyer,2005,498,https://en.wikipedia.org/wiki/Twilight_(novel
Princess Academy,Shannon Hale,2005,314,https://en.wikipedia.org/wiki/Princess_Academy
Austenland,Shannon Hale,2007,208,https://en.wikipedia.org/wiki/Austenland_(novel
The Wednesday Letters,Jason F. Wright,2007,304,https://en.wikipedia.org/wiki/Jason_F._Wright
Charly,Jack Weyland,1980,160,https://en.wikipedia.org/wiki/Charly_(novel
Ender's Game,Orson Scott Card,1985,324,https://en.wikipedia.org/wiki/Ender%27s_Game
The Memory of Earth (Homecoming Saga),Orson Scott Card,1992,355,https://en.wikipedia.org/wiki/Homecoming_Saga
Elantris,Brandon Sanderson,2005,622,https://en.wikipedia.org/wiki/Elantris
Mistborn: The Final Empire,Brandon Sanderson,2006,541,https://en.wikipedia.org/wiki/Mistborn:_The_Final_Empire
Fablehaven,Brandon Mull,2006,359,https://en.wikipedia.org/wiki/Fablehaven
Added Upon,Nephi Anderson,1898,252,https://en.wikipedia.org/wiki/Added_Upon
The Giant Joshua,Maurine Whipple,1941,637,https://en.wikipedia.org/wiki/The_Giant_Joshua
The Work and the Glory: Pillar of Light,Gerald N. Lund,1990,628,https://en.wikipedia.org/wiki/The_Work_and_the_Glory
Children of the Promise: The Locket,Dean Hughes,1997,512,https://en.wikipedia.org/wiki/Dean_Hughes
The Fire of the Covenant,Gerald N. Lund,2023,544,https://en.wikipedia.org/wiki/Gerald_N._Lund`;

    const mormonNonFictionCSV = `TITLE,AUTHOR,YEAR RELEASED,HOW MANY PAGES,LINK TO WIKIPEDIA ENTRY
An Approach to the Book of Mormon,Hugh Nibley,1957,448,https://en.wikipedia.org/wiki/Hugh_Nibley
The God Who Weeps,Terryl Givens & Fiona Givens,2012,144,https://en.wikipedia.org/wiki/Terryl_Givens
The Crucible of Doubt,Terryl Givens & Fiona Givens,2014,192,https://en.wikipedia.org/wiki/The_Crucible_of_Doubt
The Book of Mormon: A Very Short Introduction,Terryl Givens,2020,160,https://en.wikipedia.org/wiki/A_Very_Short_Introduction
The 7 Habits of Highly Effective People,Stephen R. Covey,1989,381,https://en.wikipedia.org/wiki/The_7_Habits_of_Highly_Effective_People
Believing Christ,Stephen E. Robinson,1992,144,https://en.wikipedia.org/wiki/Stephen_E._Robinson
Light in the Wilderness,Chieko N. Okazaki,1993,160,https://en.wikipedia.org/wiki/Chieko_N._Okazaki
The Broken Heart,Bruce C. Hafen,1994,224,https://en.wikipedia.org/wiki/Bruce_C._Hafen
Standing for Something,Gordon B. Hinckley,2000,205,https://en.wikipedia.org/wiki/Gordon_B._Hinckley
Amazed by Grace,Sheri L. Dew,2015,240,https://en.wikipedia.org/wiki/Sheri_L._Dew
No Man Knows My History,Fawn M. Brodie,1945,499,https://en.wikipedia.org/wiki/No_Man_Knows_My_History
The Mormon Experience,Leonard J. Arrington & Davis Bitton,1979,416,https://en.wikipedia.org/wiki/The_Mormon_Experience
Mormon Enigma: Emma Hale Smith,Linda K. Newell & Valeen T. Avery,1984,432,https://en.wikipedia.org/wiki/Mormon_Enigma:_Emma_Hale_Smith
Joseph Smith: Rough Stone Rolling,Richard Bushman,2005,740,https://en.wikipedia.org/wiki/Joseph_Smith:_Rough_Stone_Rolling
Saints: The Standard of Truth (Vol. 1),The Church of Jesus Christ of Latter-day Saints,2018,687,https://en.wikipedia.org/wiki/Saints_(book_series
First Vision: Memory and Mormon Origins,Steven C. Harper,2019,264,https://en.wikipedia.org/wiki/Steven_C._Harper
Jesus the Christ,James E. Talmage,1915,754,https://en.wikipedia.org/wiki/Jesus_the_Christ_(book
A Marvelous Work and a Wonder,LeGrand Richards,1950,424,https://en.wikipedia.org/wiki/A_Marvelous_Work_and_a_Wonder
Mormon Doctrine,Bruce R. McConkie,1958,856,https://en.wikipedia.org/wiki/Mormon_Doctrine_(book
The Miracle of Forgiveness,Spencer W. Kimball,1969,357,https://en.wikipedia.org/wiki/The_Miracle_of_Forgiveness
A Witness and a Warning,Ezra Taft Benson,1988,133,https://en.wikipedia.org/wiki/Ezra_Taft_Benson
Our Search for Happiness,M. Russell Ballard,1993,192,https://en.wikipedia.org/wiki/M._Russell_Ballard`;

    const mormonPodcastsCSV = `TITLE,PODCAST NETWORK,YEAR INITIALLY RELEASED,GENRE,LINK TO PODCAST
Mormon Stories Podcast,Open Stories Foundation,2005,Interview / Critique / History,https://www.mormonstories.org/
Sunstone Magazine Podcast,Sunstone Education Foundation,2010,Culture / Discussion / Scholarly,https://sunstone.org/podcast/
This Week in Mormons,Independent,2012,News / Commentary,https://podcasts.apple.com/us/podcast/this-week-in-mormons/id534937313
Radio Free Mormon,Independent,2017,Critique / Exegesis,https://radiofreemormon.org/
Mormon Discussion Podcast,Mormon Discussion Inc.,2012,History / Critique / Interview,https://mormondiscussionpodcast.org/
Maxwell Institute Podcast,Maxwell Institute (BYU),2014,Scholarly / Interview,https://mi.byu.edu/podcast/
Dialogue Journal Podcast,Dialogue Foundation,2017,Scholarly / Interview,https://www.dialoguejournal.com/podcast/
LDS Perspectives Podcast,Independent,2016,Scholarly / Interview,https://ldsperspectives.com/
Faith Matters,Faith Matters Foundation,2017,Interview / Theological Discussion,https://faithmatters.org/podcasts/
The Interpreter Foundation Podcast,The Interpreter Foundation,2013,Apologetics / Scholarly,https://interpreterfoundation.org/podcasts/
This Is the Gospel,LDS Living,2019,Storytelling / Devotional,https://www.ldsliving.com/this-is-the-gospel
Don't Miss This,Independent,2019,Doctrinal Study,https://www.dontmissthisstudy.com/
"Follow Him: A Come, Follow Me Podcast",Independent,2020,Doctrinal Study / Interview,https://www.followhim.co/
Leading Saints,Independent,2014,Leadership / Interview,https://leadingsaints.org/
Talking Scripture,Independent,2019,Doctrinal Study,https://www.talkingscripture.org/
The General Conference Podcast,The Church of Jesus Christ of Latter-day Saints,2018,Doctrinal Address,https://www.churchofjesuschrist.org/inspiration/latter-day-saints-channel/podcasts/general-conference
Saints,The Church of Jesus Christ of Latter-day Saints,2018,History / Narrative,https://www.churchofjesuschrist.org/inspiration/latter-day-saints-channel/podcasts/saints
All In,LDS Living,2018,Interview / Devotional,https://www.ldsliving.com/all-in
Latter-day Saint Women,The Church of Jesus Christ of Latter-day Saints,2019,Interview / Discussion,https://www.churchofjesuschrist.org/inspiration/latter-day-saints-channel/podcasts/latter-day-saint-women
Sunday on Monday,Deseret Book,2021,Doctrinal Study,https://deseretbook.com/p/sunday-on-monday`;

    const mormonArchitectureCSV = `TITLE,ARCHITECT,YEAR COMPLETED,HOW MUCH DID IT COST TO BUILD,LINK TO WIKIPEDIA ENTRY
Nauvoo Illinois Temple (Rebuilt),FFKR Architects,2002,"Estimated $30,000,000+",https://en.wikipedia.org/wiki/Nauvoo_Temple
Draper Utah Temple,FFKR Architects,2009,Not publicly disclosed,https://en.wikipedia.org/wiki/Draper_Utah_Temple
Provo City Center Temple,FFKR Architects,2016,Not publicly disclosed,https://en.wikipedia.org/wiki/Provo_City_Center_Temple
Paris France Temple,"Patriarche & Co, Jean-Michel Reymondon",2017,Not publicly disclosed,https://en.wikipedia.org/wiki/Paris_France_Temple
Rome Italy Temple,Neils Valentiner & Associates,2019,Not publicly disclosed,https://en.wikipedia.org/wiki/Rome_Italy_Temple
Joseph Smith Memorial Building,Parkinson and Bergstrom,1911,"Approx. $2,000,000 (1910s USD)",https://en.wikipedia.org/wiki/Joseph_Smith_Memorial_Building
Church Office Building,George Cannon Young,1972,"$31,500,000 (1970s USD)",https://en.wikipedia.org/wiki/Church_Office_Building
Conference Center,Zimmer Gunsul Frasca Partnership (ZGF),2000,Estimated $250-300 million,https://en.wikipedia.org/wiki/Conference_Center
Church History Library,"FFKR Architects, HOK",2009,Not publicly disclosed,https://en.wikipedia.org/wiki/Church_History_Library
Laie Hawaii Temple,Hyrum Pope & Harold Burton,1919,"Approx. $215,000 (1910s USD)",https://en.wikipedia.org/wiki/Laie_Hawaii_Temple
Cardston Alberta Temple,Hyrum Pope & Harold Burton,1923,"Approx. $800,000 (1920s USD)",https://en.wikipedia.org/wiki/Cardston_Alberta_Temple
Los Angeles California Temple,Edward O. Anderson,1956,"$6,000,000 (1950s USD)",https://en.wikipedia.org/wiki/Los_Angeles_California_Temple
Oakland California Temple,Harold W. Burton,1964,Not publicly disclosed,https://en.wikipedia.org/wiki/Oakland_California_Temple
Washington D.C. Temple,"Emil B. Fetzer, et al.",1974,"Approx. $15,000,000 (1970s USD)",https://en.wikipedia.org/wiki/Washington_D.C._Temple
Jordan River Utah Temple,Emil B. Fetzer,1981,Paid for by member donations,https://en.wikipedia.org/wiki/Jordan_River_Utah_Temple
Kirtland Temple,"Joseph Smith (as revelator), committee",1836,"Approx. $40,000 (1830s USD)",https://en.wikipedia.org/wiki/Kirtland_Temple
Nauvoo Temple (Original),William Weeks,1846,"Approx. $1,000,000 (1840s USD)",https://en.wikipedia.org/wiki/Nauvoo_Temple
Salt Lake Tabernacle,"Henry Grow, Truman O. Angell",1867,"Approx. $300,000 (1860s USD)",https://en.wikipedia.org/wiki/Salt_Lake_Tabernacle
St. George Utah Temple,"Truman O. Angell, Miles Romney",1877,"Approx. $800,000 (1870s USD)",https://en.wikipedia.org/wiki/St._George_Utah_Temple
Logan Utah Temple,"Truman O. Angell, Jr.",1884,"Approx. $700,000 (1880s USD)",https://en.wikipedia.org/wiki/Logan_Utah_Temple
Salt Lake Temple,Truman O. Angell,1893,"Approx. $4,000,000 (1890s USD)",https://en.wikipedia.org/wiki/Salt_Lake_Temple`;

    const mormonVisualArtCSV = `TITLE,ARTIST,YEAR COMPLETED,GENRE,LINK TO WIKIPEDIA ENTRY
Flight,Brian Kershisnik,1999,Contemporary Figurative,https://en.wikipedia.org/wiki/Brian_Kershisnik
Jesus and the Fishermen,Brian Kershisnik,2005,Contemporary Figurative,https://en.wikipedia.org/wiki/Brian_Kershisnik
Christus Consolator,Bertel Thorvaldsen,1838,Neoclassical Sculpture,https://en.wikipedia.org/wiki/Christus_(statue
Tragedy of Winter Quarters,Avard Fairbanks,1936,Bronze Sculpture,https://en.wikipedia.org/wiki/Avard_Fairbanks
Joseph Smith (in the U.S. Capitol),Mahonri Young,1950,Bronze Sculpture,https://en.wikipedia.org/wiki/Mahonri_Young
Moroni (on Salt Lake Temple),Cyrus E. Dallin,1893,Gilt Bronze Sculpture,https://en.wikipedia.org/wiki/Cyrus_E._Dallin
He is Risen,Walter Rane,2002,Religious Realism / History Painting,https://en.wikipedia.org/wiki/Walter_Rane
In His Constant Care,Greg Olsen,1993,Religious Realism / Devotional Art,https://en.wikipedia.org/wiki/Greg_Olsen_(artist
O Jerusalem,Greg Olsen,1995,Religious Realism / Devotional Art,https://en.wikipedia.org/wiki/Greg_Olsen_(artist
World Room Murals (in the Manti Temple),Minerva Teichert,1947,Mural / American Regionalism,https://en.wikipedia.org/wiki/Minerva_Teichert
Christ in a Red Robe,Minerva Teichert,1949,History Painting,https://en.wikipedia.org/wiki/Minerva_Teichert
The Title of Liberty (from Book of Mormon series),Arnold Friberg,1951,Heroic Realism / Illustration,https://en.wikipedia.org/wiki/Arnold_Friberg
The Prayer at Valley Forge,Arnold Friberg,1975,History Painting,https://en.wikipedia.org/wiki/The_Prayer_at_Valley_Forge
The Red-Roofed Chapel,LeConte Stewart,1961,Landscape / Mormon Impressionism,https://en.wikipedia.org/wiki/LeConte_Stewart
The First Vision,Tom Lovell,1968,Illustration / Realism,https://en.wikipedia.org/wiki/Tom_Lovell
Mormon Panorama (series of 23 paintings),C.C.A. Christensen,1878,History Painting / Panorama,https://en.wikipedia.org/wiki/Carl_Christian_Anton_Christensen
The First Vision,"John Hafen, Lorus Pratt, & Edwin Evans",1906,History Painting,https://en.wikipedia.org/wiki/John_Hafen
Handcart Pioneers,Torleif S. Knaphus,1926,Bronze Sculpture,https://en.wikipedia.org/wiki/Torleif_S._Knaphus
Joseph Smith (Portrait),Sutcliffe Maudsley,1842,Portraiture,https://en.wikipedia.org/wiki/Religious_art_of_the_Church_of_Jesus_Christ_of_Latter-day_Saints`;

    return {
      mormonMusic: getRandomEntryFromCSV(mormonMusicCSV),
      mormonFilms: getRandomEntryFromCSV(mormonFilmsCSV),
      mormonTVShows: getRandomEntryFromCSV(mormonTVShowsCSV),
      mormonFiction: getRandomEntryFromCSV(mormonFictionCSV),
      mormonNonFiction: getRandomEntryFromCSV(mormonNonFictionCSV),
      mormonPodcasts: getRandomEntryFromCSV(mormonPodcastsCSV),
      mormonArchitecture: getRandomEntryFromCSV(mormonArchitectureCSV),
      mormonVisualArt: getRandomEntryFromCSV(mormonVisualArtCSV),
    };
  },
});