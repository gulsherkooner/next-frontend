"use client";
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Link,
  MapPin,
  Pencil,
  Plus,
} from "lucide-react";
import { useIsMobile } from "../../hooks/use-mobile";
import { useDispatch, useSelector } from "react-redux";
import getTimeAgo from "../../lib/utils/getTimeAgo";
import EditImage from "./EditImage";
import {
  fetchUserData,
  updateAccessToken,
  updateProfile,
} from "../../features/auth/authSlice";
import { getCookie } from "@/app/lib/utils/cookie";
import { followUser, unfollowUser } from "../../features/sub/subslice";
import {
  createMembership,
  fetchMembershipByUser,
} from "../../features/sub/membershipslice";
import CreateMembership1 from "../../components/membershipComponents/CreateMembership1";
import CreateMembership2 from "../../components/membershipComponents/CreateMembership2";
import CreateMembership3 from "../../components/membershipComponents/CreateMembership3";
import CreateMembership4 from "../../components/membershipComponents/CreateMembership4";
import CreateMembership5 from "../../components/membershipComponents/CreateMembership5";
import ViewMembership from "../../components/membershipComponents/ViewMembership";
import axios from "axios";
import { useRouter } from "next/navigation";

const countryCurrencyMap = {
  US: { currency: "USD", symbol: "$" },
  GB: { currency: "GBP", symbol: "£" },
  EU: { currency: "EUR", symbol: "€" },
  CA: { currency: "CAD", symbol: "C$" },
  AU: { currency: "AUD", symbol: "A$" },
  JP: { currency: "JPY", symbol: "¥" },
  IN: { currency: "INR", symbol: "₹" },
};
const fallbackRates = {
  USD: 1,
  GBP: 0.79,
  EUR: 0.85,
  CAD: 1.25,
  AUD: 1.35,
  JPY: 110,
  INR: 75,
};

const ProfileInfo = ({
  data,
  profile,
  isFollowing,
  setIsFollowing,
  fetchData,
  activeTab,
  onAddPhotoClick,
}) => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({});
  const [imgBox, setImgBox] = useState(false);
  const [bannerBox, setBannerBox] = useState(false);
  const [createMemberBox, setCreateMemberBox] = useState(0);
  const [membership, setMembership] = useState();
  const [viewMembershipBox, setViewMembershipBox] = useState(false);
  const [subscription, setSubscription] = useState({
    perks: {
      "Early Access to Posts": {
        checked: true,
        description:
          "Give subscribers a head start on new content before it's public.",
      },
      "Exclusive Videos or Stories": {
        checked: true,
        description: "Content available only to paying subscribers.",
      },
      "Private Q&A Sessions": {
        checked: false,
        description:
          "Let your subscribers ask you questions directly through comments or DMs.",
      },
      "Behind-the-Scenes Content": {
        checked: true,
        description:
          "Share your process, drafts, or daily life moments with your most loyal fans.",
      },
      "Shout-outs or Mentions": {
        checked: false,
        description: "Recognize your top subscribers in content or posts.",
      },
    },
  });
  const [rates, setRates] = useState(fallbackRates);

  // Fetch exchange rates on mount
  useEffect(() => {
    axios
      .get(
        "https://api.frankfurter.app/latest?from=USD&to=USD,GBP,EUR,CAD,AUD,JPY,INR"
      )
      .then((res) => {
        setRates({ USD: 1, ...res.data.rates });
      })
      .catch(() => {
        setRates(fallbackRates);
      });
  }, []);

  useEffect(() => {
    setUserData({
      email: data?.email,
      username: data?.username,
      name: data?.name,
      bio: data?.bio,
      profile_img_url: data?.profile_img_url,
      created_at: data?.created_at,
      followers: data?.followers,
      following: data?.following,
      banner_img_url: data?.banner_img_url,
      is_verified: data?.is_verified || false,
      profile_img_data: "",
      banner_img_data: "",
    });
  }, [data]);

  useEffect(() => {
    if (data?.user_id) {
      dispatch(fetchMembershipByUser(data.user_id))
        .unwrap()
        .then((result) => {
          setMembership(result);
        })
        .catch(() => {
          setMembership(undefined);
        });
    }
  }, [data?.user_id, dispatch]);

  const handleInputChange = (e) => {
    // const { name, value } = e.target;
    // setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    // try {
    //   await dispatch(updateProfile(userData)).unwrap();
    //   setIsEditing(false);
    // } catch (err) {
    //   console.error("Failed to update profile:", err);
    // }
  };

  const handleImageUpdate = (postFile) => {
    setUserData({ ...userData, profile_img_data: postFile });
    // dispatch(updateProfile(userData)).unwrap();
    setImgBox(false);
  };
  const handleBannerUpdate = (postFile) => {
    setUserData({ ...userData, banner_img_data: postFile });
    // dispatch(updateProfile(userData)).unwrap();
    setBannerBox(false);
  };

  useEffect(() => {
    if (userData.profile_img_data || userData.banner_img_data) {
      dispatch(updateProfile(userData)).unwrap();
      dispatch(fetchUserData());
    }
  }, [userData.profile_img_data, userData.banner_img_data]);

  const handleFollow = () => {
    dispatch(followUser(data.user_id));
    fetchData(data.user_id);
    setIsFollowing(true);
  };
  const handleUnfollow = () => {
    dispatch(unfollowUser(data.user_id));
    fetchData(data.user_id);
    setIsFollowing(false);
  };

  const handleSubmitMembership = () => {
    dispatch(createMembership({ ...subscription, user_id: data.user_id }));
    setCreateMemberBox(0);
  };

  return (
    <div className="relative">
      {viewMembershipBox && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center">
          <div className="h-fit max-h-screen bg-white flex flex-col rounded-lg overflow-hidden">
            {membership && (
              <ViewMembership
                membership={membership}
                profile={profile}
                countryCurrencyMap={countryCurrencyMap}
                channel={userData?.username}
                rates={rates}
                onClose={() => setViewMembershipBox(!viewMembershipBox)}
              />
            )}
          </div>
        </div>
      )}
      {createMemberBox !== 0 && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex items-center justify-center">
          <div className="h-fit max-h-screen bg-white flex flex-col rounded-lg overflow-hidden">
            <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
              <div className="flex items-center gap-4 md:px-6 md:py-4 p-2 border-b border-gray-300">
                <ArrowLeft
                  onClick={() => setCreateMemberBox(0)}
                  className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800"
                />
                <h1 className=" text-xl md:text-2xl font-semibold text-gray-900">
                  Start Earning with Premium Content
                </h1>
              </div>
            </div>
            {createMemberBox === 1 && (
              <CreateMembership1 setCreateMemberBox={setCreateMemberBox} />
            )}
            {createMemberBox === 2 && (
              <CreateMembership2
                setCreateMemberBox={setCreateMemberBox}
                setSubscription={setSubscription}
                subscription={subscription}
                countryCurrencyMap={countryCurrencyMap}
                rates={rates}
              />
            )}
            {createMemberBox === 3 && (
              <CreateMembership3
                setCreateMemberBox={setCreateMemberBox}
                setSubscription={setSubscription}
                subscription={subscription}
              />
            )}
            {createMemberBox === 4 && (
              <CreateMembership4
                setCreateMemberBox={setCreateMemberBox}
                setSubscription={setSubscription}
                subscription={subscription}
              />
            )}
            {createMemberBox === 5 && (
              <CreateMembership5
                setCreateMemberBox={setCreateMemberBox}
                setSubscription={setSubscription}
                subscription={subscription}
                countryCurrencyMap={countryCurrencyMap}
                onClose={() => handleSubmitMembership()}
              />
            )}
          </div>
        </div>
      )}
      {/* Cover Photo */}
      <div className="w-full h-60 md:h-60 bg-gray-300">
        <div className="w-full h-60 relative">
          <div className="bg-gray-900 w-full h-full overflow-hidden rounded-sm">
            {userData.banner_img_url && (
              <img
                src={userData.banner_img_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {profile && (
            <>
              <div
                className="absolute top-2 right-3 text-black bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
                onClick={() => setBannerBox(true)}
              >
                <Pencil size={16} />
              </div>
              {bannerBox && (
                <EditImage
                  setImgBox={setBannerBox}
                  imgBox={bannerBox}
                  onSave={handleBannerUpdate}
                  w={16}
                  h={9}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Profile Picture and Basic Info */}
      <div className="relative px-4">
        {/* Profile Picture */}
        <div className="absolute -top-16 left-4 w-32 h-32 rounded-full bg-gray-400 border-4 border-white">
          <div className="w-full h-full relative">
            {userData.profile_img_url && (
              <img
                src={userData.profile_img_url}
                alt="Profile"
                className="rounded-full"
              />
            )}
            {profile && (
              <>
                <div
                  className="absolute top-1 right-1 text-black bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                  onClick={() => setImgBox(true)}
                >
                  <Pencil size={16} />
                </div>
                {imgBox && (
                  <EditImage
                    setImgBox={setImgBox}
                    imgBox={imgBox}
                    onSave={handleImageUpdate}
                    w={1}
                    h={1}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* User Info and Actions */}
        <div className="pt-20 pb-4">
          <div className="flex justify-start items-center space-x-2">
            <div>
              <h1 className="text-xl font-bold">
                {userData.name ? userData.name : "Username"}
              </h1>
              <p className="text-gray-500 text-sm">
                @{userData.username ? userData.username : "Username"}
              </p>
            </div>
            {profile ? (
              <>
                <button
                  onClick={() => router.push("/settings")}
                  className={`${
                    isMobile ? "py-2 px-3" : "py-1 px-4"
                  } rounded-full bg-gray-200 text-sm font-medium cursor-pointer`}
                >
                  {isMobile ? <Pencil size={16} /> : "Edit profile"}
                </button>
                {activeTab === "dating" && (
                  <button
                    onClick={onAddPhotoClick}
                    className={`${
                      isMobile ? "py-2 px-3" : "py-1 px-4"
                    } rounded-full bg-white border border-gray-300`}
                  >
                    {isMobile ? <Plus size={16} /> : "+ Add Photo"}
                  </button>
                )}
                <button
                  className={`px-3 ${
                    isMobile ? "py-2" : "py-1"
                  } rounded-full bg-white border border-gray-300`}
                >
                  <div className="flex items-center justify-center">
                    <Plus size={16} />
                    {!isMobile && (
                      <span className="ml-1 text-sm font-medium cursor-pointer">
                        Create story
                      </span>
                    )}
                  </div>
                </button>
                {/* Membership Button Logic */}
                {membership ? (
                  <button
                    onClick={() => setViewMembershipBox(!viewMembershipBox)}
                    className={`${
                      isMobile ? "py-2 px-3" : "py-1 px-4"
                    } rounded-full bg-gray-200 text-sm font-medium cursor-pointer`}
                  >
                    {isMobile ? <BadgeCheck size={16} /> : "Membership"}
                  </button>
                ) : (
                  <button
                    onClick={() => setCreateMemberBox(1)}
                    className={`${
                      isMobile ? "py-2 px-3" : "py-1 px-4"
                    } rounded-full bg-gray-200 text-sm font-medium cursor-pointer`}
                  >
                    {isMobile ? <BadgeCheck size={16} /> : "Create memberships"}
                  </button>
                )}
              </>
            ) : (
              <>
                {isFollowing ? (
                  <button
                    className={`${
                      isMobile ? "py-2 px-3" : "py-1 px-4"
                    } rounded-full bg-gray-200 text-sm font-medium cursor-pointer`}
                    onClick={() => handleUnfollow()}
                  >
                    {isMobile ? <Pencil size={16} /> : "Following"}
                  </button>
                ) : (
                  <button
                    className={`${
                      isMobile ? "py-2 px-3" : "py-1 px-4"
                    } rounded-full bg-gray-200 text-sm font-medium cursor-pointer`}
                    onClick={() => handleFollow()}
                  >
                    {isMobile ? <Pencil size={16} /> : "Follow"}
                  </button>
                )}
                {/* Subscribe Button Logic */}
                {membership && (
                  <button
                    onClick={() => setViewMembershipBox(!viewMembershipBox)}
                    className={`${
                      isMobile ? "py-2 px-3" : "py-1 px-4"
                    } rounded-full bg-gray-200 text-sm font-medium cursor-pointer`}
                  >
                    {isMobile ? <BadgeCheck size={16} /> : "Subscribe"}
                  </button>
                )}
                {/* If membership is not there and profile is false, no button is shown */}
              </>
            )}
          </div>

          {/* Bio */}
          <div className="my-3 text-sm">
            <p>{userData.bio}</p>
          </div>

          {/* Links and Info */}
          <div className="flex flex-wrap items-center text-sm text-gray-500 space-x-4">
            <div className="flex items-center">
              <Link size={18} />
              <span className="ml-1 text-blue-500">
                https://t.co/tVu61hqoskedwjs
              </span>
            </div>
            <div className="flex items-center">
              <MapPin size={18} />
              <span className="ml-1">Mumbai, India</span>
            </div>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                <line x1="16" x2="16" y1="2" y2="6"></line>
                <line x1="8" x2="8" y1="2" y2="6"></line>
                <line x1="3" x2="21" y1="10" y2="10"></line>
              </svg>
              <span className="ml-1">
                Joined {getTimeAgo(data?.created_at)}
              </span>
            </div>
          </div>

          {/* Followers */}
          <div className="flex space-x-4 mt-3 text-sm">
            <div>
              <span className="font-bold">{data?.followers}</span>{" "}
              <span className="text-gray-500">Followers</span>
            </div>
            <div>
              <span className="font-bold">{data?.following}</span>{" "}
              <span className="text-gray-500">Following</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
