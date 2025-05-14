
import React from 'react';
import { Calendar, Eye, Link, Mail, MapPin, Phone, UserRoundCheck } from 'lucide-react';

const AboutTab = () => {
  return (
    <div className="p-4">
      {/* Description */}
      <div className="bg-gray-100 p-4 rounded-md mb-4">
        <h3 className="font-medium mb-2">Profile description</h3>
        <p className="text-sm text-gray-700">
          Yorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero sectetur adipiscing elit. Nunc vulpYorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero sectetur adipiscing elit. Nunc vulputate libero r adipiscing elit. Nunc vulpYorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero
        </p>
        <p className="text-sm text-gray-700 mt-2">
          elit. Nunc vulpYorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Profile Details */}
        <div className="bg-gray-100 p-4 rounded-md flex-1">
          <h3 className="font-medium mb-2">Profile details</h3>
          
          <div className="space-y-4">
            <InfoItem 
              icon={<Link size={18} />} 
              title="Public URL" 
              value="www.website.com/@Profilename.com"
            />
            
            <InfoItem 
              icon={<Calendar size={18} />} 
              title="Date joined" 
              value="11th May 2024"
            />
            
            <InfoItem 
              icon={<MapPin size={18} />} 
              title="Account based in" 
              value="Mumbai, India"
            />
            
            <InfoItem 
              icon={<UserRoundCheck size={18} />} 
              title="Followers" 
              value="123,000"
            />
            
            <InfoItem 
              icon={<Eye size={18} />} 
              title="Views" 
              value="450,012"
            />
            
            <InfoItem 
              icon={<Phone size={18} />} 
              title="Mobile" 
              value="07903 97002"
            />
            
            <InfoItem 
              icon={<Mail size={18} />} 
              title="Email" 
              value="Name123@gmail.com"
            />
          </div>
        </div>

        {/* Links */}
        <div className="bg-gray-100 p-4 rounded-md flex-1">
          <h3 className="font-medium mb-2">Links</h3>
          
          <div className="space-y-4">
            <SocialLink 
              name="Instagram" 
              url="www.instagram.com/@Profilename.com"
            />
            
            <SocialLink 
              name="Twitter" 
              url="www.twitter.com/@Profilename.com"
            />
            
            <SocialLink 
              name="Facebook" 
              url="www.facebook.com/@Profilename.com"
            />
            
            <SocialLink 
              name="Youtube" 
              url="www.youtube.com/@Profilename.com"
            />
            
            <SocialLink 
              name="Twitch" 
              url="www.twitch.com/@Profilename.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, title, value }) => {
  return (
    <div className="flex items-center">
      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium">{value}</div>
        <div className="text-xs text-gray-500">{title}</div>
      </div>
    </div>
  );
};

const SocialLink = ({ name, url }) => {
  return (
    <div className="flex items-center">
      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
      </div>
      <div>
        <div className="text-sm font-medium">{name}</div>
        <div className="text-xs text-gray-700">{url}</div>
      </div>
    </div>
  );
};

export default AboutTab;
