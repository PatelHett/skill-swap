import mongoose from "mongoose";
import dotenv from "dotenv";
import Skill from "../models/Skills.model.js";

dotenv.config();

const initialSkills = [
  {
    skillId: "skill_photoshop",
    name: "Photoshop",
    category: "Design",
    createdBy: "admin",
    creatorId: new mongoose.Types.ObjectId(), // Generate a new ObjectId for admin
    description: "Adobe Photoshop for image editing and graphic design",
    isActive: true,
  },
  {
    skillId: "skill_illustrator",
    name: "Illustrator",
    category: "Design",
    createdBy: "admin",
    creatorId: new mongoose.Types.ObjectId(),
    description: "Adobe Illustrator for vector graphics and illustrations",
    isActive: true,
  },
  {
    skillId: "skill_excel",
    name: "Excel",
    category: "Business",
    createdBy: "admin",
    creatorId: new mongoose.Types.ObjectId(),
    description: "Microsoft Excel for data analysis and spreadsheet management",
    isActive: true,
  },
  {
    skillId: "skill_python",
    name: "Python",
    category: "Programming",
    createdBy: "admin",
    creatorId: new mongoose.Types.ObjectId(),
    description:
      "Python programming language for web development and data science",
    isActive: true,
  },
  {
    skillId: "skill_javascript",
    name: "JavaScript",
    category: "Programming",
    createdBy: "admin",
    creatorId: new mongoose.Types.ObjectId(),
    description: "JavaScript for web development and frontend programming",
    isActive: true,
  },
  {
    skillId: "skill_cooking",
    name: "Cooking",
    category: "Lifestyle",
    createdBy: "admin",
    creatorId: new mongoose.Types.ObjectId(),
    description: "Culinary skills and recipe creation",
    isActive: true,
  },
  {
    skillId: "skill_photography",
    name: "Photography",
    category: "Arts",
    createdBy: "admin",
    creatorId: new mongoose.Types.ObjectId(),
    description: "Digital and film photography techniques",
    isActive: true,
  },
  {
    skillId: "skill_guitar",
    name: "Guitar",
    category: "Music",
    createdBy: "admin",
    creatorId: new mongoose.Types.ObjectId(),
    description: "Acoustic and electric guitar playing",
    isActive: true,
  },
  {
    skillId: "skill_spanish",
    name: "Spanish",
    category: "Language",
    createdBy: "admin",
    creatorId: new mongoose.Types.ObjectId(),
    description: "Spanish language speaking and writing",
    isActive: true,
  },
  {
    skillId: "skill_yoga",
    name: "Yoga",
    category: "Fitness",
    createdBy: "admin",
    creatorId: new mongoose.Types.ObjectId(),
    description: "Yoga practice and meditation techniques",
    isActive: true,
  },
];

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_DB_CONNECTION_URL}`
    );
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection error: ", error);
    process.exit(1);
  }
};

const seedSkills = async () => {
  try {
    await connectDb();

    // Clear existing skills
    await Skill.deleteMany({});
    console.log("Cleared existing skills");

    // Insert new skills
    const result = await Skill.insertMany(initialSkills);
    console.log(`Successfully seeded ${result.length} skills`);

    // Display seeded skills
    console.log("\nSeeded skills:");
    result.forEach((skill) => {
      console.log(`- ${skill.name} (${skill.category})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding skills:", error);
    process.exit(1);
  }
};

seedSkills();
