import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  GraduationCap,
  Heart,
  Home,
  Info,
  Mail,
  MapPin,
  Phone,
  User,
  Globe,
  Twitter,
  Cake,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4  pt-4 px-4">
      <div className="md:col-span-1">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">About</h2>
          <nav className="space-y-1">
            <Link
              href="#overview"
              className="flex items-center px-3 py-2 text-blue-600 bg-blue-50 rounded-md font-medium"
            >
              <Info className="h-5 w-5 mr-3" />
              Overview
            </Link>
            <Link
              href="#work"
              className="flex items-center px-3 py-2 text-gray-700 hover: rounded-md"
            >
              <Briefcase className="h-5 w-5 mr-3" />
              Work and Education
            </Link>
            <Link
              href="#places"
              className="flex items-center px-3 py-2 text-gray-700 hover: rounded-md"
            >
              <MapPin className="h-5 w-5 mr-3" />
              Places Lived
            </Link>
            <Link
              href="#contact"
              className="flex items-center px-3 py-2 text-gray-700 hover: rounded-md"
            >
              <Phone className="h-5 w-5 mr-3" />
              Contact and Basic Info
            </Link>
            <Link
              href="#family"
              className="flex items-center px-3 py-2 text-gray-700 hover: rounded-md"
            >
              <Heart className="h-5 w-5 mr-3" />
              Family and Relationships
            </Link>
            <Link
              href="#details"
              className="flex items-center px-3 py-2 text-gray-700 hover: rounded-md"
            >
              <User className="h-5 w-5 mr-3" />
              Details About You
            </Link>
          </nav>
        </div>
      </div>

      <div className="md:col-span-2 space-y-4">
        {/* Overview Section */}
        <div id="overview" className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Overview</h3>
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <Briefcase className="h-5 w-5 mr-3 mt-1 text-gray-500" />
              <div>
                <p className="font-medium">Product Designer at Facebook</p>
                <p className="text-gray-500 text-sm">August 2018 - Present</p>
              </div>
            </div>

            <div className="flex items-start">
              <Briefcase className="h-5 w-5 mr-3 mt-1 text-gray-500" />
              <div>
                <p className="font-medium">UI/UX Designer at Google</p>
                <p className="text-gray-500 text-sm">June 2015 - July 2018</p>
              </div>
            </div>

            <div className="flex items-start">
              <GraduationCap className="h-5 w-5 mr-3 mt-1 text-gray-500" />
              <div>
                <p className="font-medium">Stanford University</p>
                <p className="text-gray-500 text-sm">
                  Master of Design · 2013 - 2015
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Home className="h-5 w-5 mr-3 mt-1 text-gray-500" />
              <div>
                <p className="font-medium">
                  Lives in San Francisco, California
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-3 mt-1 text-gray-500" />
              <div>
                <p className="font-medium">From New York, New York</p>
              </div>
            </div>

            <div className="flex items-start">
              <Heart className="h-5 w-5 mr-3 mt-1 text-gray-500" />
              <div>
                <p className="font-medium">Married to Jane Doe</p>
                <p className="text-gray-500 text-sm">Since June 12, 2019</p>
              </div>
            </div>
          </div>
        </div>

        {/* Work and Education */}
        <div id="work" className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Work and Education</h3>
            <Button variant="ghost" size="sm">
              Add
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium mb-2">Work</h4>
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                      <Image
                        src="/placeholder.svg?height=48&width=48&text=FB"
                        alt="Facebook"
                        width={48}
                        height={48}
                        className="rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Product Designer</p>
                    <p className="text-sm">Connecto</p>
                    <p className="text-gray-500 text-sm">
                      August 2018 - Present · San Francisco, California
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                      <Image
                        src="/placeholder.svg?height=48&width=48&text=G"
                        alt="Google"
                        width={48}
                        height={48}
                        className="rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">UI/UX Designer</p>
                    <p className="text-sm">Google</p>
                    <p className="text-gray-500 text-sm">
                      June 2015 - July 2018 · Mountain View, California
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-2">Education</h4>
              <div className="space-y-4">
                <div className="flex">
                  <div className="mr-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                      <Image
                        src="/placeholder.svg?height=48&width=48&text=SU"
                        alt="Stanford University"
                        width={48}
                        height={48}
                        className="rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Stanford University</p>
                    <p className="text-gray-500 text-sm">
                      Master of Design · 2013 - 2015
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                      <Image
                        src="/placeholder.svg?height=48&width=48&text=NYU"
                        alt="New York University"
                        width={48}
                        height={48}
                        className="rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">New York University</p>
                    <p className="text-gray-500 text-sm">
                      Bachelor of Fine Arts, Design · 2009 - 2013
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Places Lived */}
        <div id="places" className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Places Lived</h3>
            <Button variant="ghost" size="sm">
              Add
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex">
              <div className="mr-3">
                <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                  <Home className="h-6 w-6 text-gray-500" />
                </div>
              </div>
              <div>
                <p className="font-medium">Current City</p>
                <p className="text-gray-500">San Francisco, California</p>
              </div>
            </div>

            <div className="flex">
              <div className="mr-3">
                <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-gray-500" />
                </div>
              </div>
              <div>
                <p className="font-medium">Hometown</p>
                <p className="text-gray-500">New York, New York</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact and Basic Info */}
        <div id="contact" className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Contact and Basic Info</h3>
            <Button variant="ghost" size="sm">
              Add
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium mb-2">Contact Info</h4>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <p className="font-medium">Mobile</p>
                    <p className="text-gray-500">(555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-500">johndoe@example.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-2">
                Websites and Social Links
              </h4>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Globe className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <p className="font-medium">Website</p>
                    <p className="text-blue-600">johndoe.com</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Twitter className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <p className="font-medium">Twitter</p>
                    <p className="text-blue-600">twitter.com/johndoe</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-2">Basic Info</h4>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Cake className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <p className="font-medium">Birth Date</p>
                    <p className="text-gray-500">January 15, 1988</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <User className="h-5 w-5 mr-3 text-gray-500" />
                  <div>
                    <p className="font-medium">Gender</p>
                    <p className="text-gray-500">Male</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
