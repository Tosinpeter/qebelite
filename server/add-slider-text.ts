import postgres from "postgres";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

async function addSliderText() {
  console.log("Adding text field to home_slider table and seeding data...");
  
  const supabaseClient = postgres(process.env.SUPABASE_DB_CONNECTION_STRING!, { 
    prepare: false, 
    ssl: 'require',
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10
  });

  try {
    console.log("Adding text column...");
    await supabaseClient`
      ALTER TABLE home_slider 
      ADD COLUMN IF NOT EXISTS text TEXT`;
    
    console.log("✅ Column added successfully.");
    
    console.log("Seeding text data for existing slides...");
    
    const slides = await supabaseClient`
      SELECT id, position FROM home_slider ORDER BY position`;
    
    const textData = [
      "Transform Your Body",
      "Join Our Community",
      "Expert Training Programs",
      "Nutrition Guidance",
      "Achieve Your Goals"
    ];
    
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const text = textData[slide.position] || textData[i] || "Fitness Excellence";
      
      await supabaseClient`
        UPDATE home_slider 
        SET text = ${text}
        WHERE id = ${slide.id}`;
      
      console.log(`✅ Updated slide ${i + 1} with text: "${text}"`);
    }
    
    console.log("✅ All slides seeded successfully.");
    
  } catch (error) {
    console.error("❌ Failed:", error);
    throw error;
  } finally {
    await supabaseClient.end();
  }
}

addSliderText();
