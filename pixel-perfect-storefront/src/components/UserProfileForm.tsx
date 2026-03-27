import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

interface UserProfile {
  leadOrigin: string;
  leadSource: string;
  hearAboutUs: string;
  coursePreferences: string[];
  leadProfile: string;
}

interface UserProfileFormProps {
  userEmail: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const LEAD_ORIGINS = ['Google', 'Facebook', 'LinkedIn', 'Instagram', 'Twitter', 'Email', 'Referral', 'Direct', 'Other'];
const HEAR_ABOUT_US = ['Search Engine', 'Social Media', 'Friend/Colleague', 'Advertisement', 'Content Marketing', 'Other'];
const COURSE_PREFERENCES = [
  'Career Growth',
  'Skill Development',
  'Certification',
  'Salary Increase',
  'Job Security',
  'Cost Effective',
  'Industry Relevant'
];
const LEAD_PROFILES = ['Student', 'Working Professional', 'Career Changer', 'Entrepreneur', 'Other'];

export const UserProfileForm = ({ userEmail, onSuccess, onCancel }: UserProfileFormProps) => {
  const [profile, setProfile] = useState<UserProfile>({
    leadOrigin: 'Direct',
    leadSource: 'direct',
    hearAboutUs: 'Other',
    coursePreferences: [],
    leadProfile: 'Other'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePreferenceToggle = (pref: string) => {
    setProfile(prev => ({
      ...prev,
      coursePreferences: prev.coursePreferences.includes(pref)
        ? prev.coursePreferences.filter(p => p !== pref)
        : [...prev.coursePreferences, pref]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/user/profile/${encodeURIComponent(userEmail)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl bg-slate-800 border-slate-700">
      <CardHeader className="bg-slate-900 border-b border-slate-700">
        <CardTitle className="text-white">Complete Your Profile</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {error && (
          <div className="p-3 bg-red-900 border border-red-700 text-red-200 rounded">
            {error}
          </div>
        )}

        {/* Lead Origin */}
        <div className="space-y-2">
          <label className="text-slate-300 font-medium">1. Lead Origin - How did you find us?</label>
          <select
            value={profile.leadOrigin}
            onChange={(e) => setProfile({ ...profile, leadOrigin: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 text-slate-100 px-3 py-2 rounded"
          >
            {LEAD_ORIGINS.map(origin => (
              <option key={origin} value={origin}>{origin}</option>
            ))}
          </select>
        </div>

        {/* Lead Source */}
        <div className="space-y-2">
          <label className="text-slate-300 font-medium">2. Lead Source - Traffic type</label>
          <select
            value={profile.leadSource}
            onChange={(e) => setProfile({ ...profile, leadSource: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 text-slate-100 px-3 py-2 rounded"
          >
            <option value="organic">Organic</option>
            <option value="paid">Paid</option>
            <option value="referral">Referral</option>
            <option value="direct">Direct</option>
            <option value="social">Social</option>
            <option value="email">Email</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* How did you hear about us */}
        <div className="space-y-2">
          <label className="text-slate-300 font-medium">3. How did you hear about us?</label>
          <select
            value={profile.hearAboutUs}
            onChange={(e) => setProfile({ ...profile, hearAboutUs: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 text-slate-100 px-3 py-2 rounded"
          >
            {HEAR_ABOUT_US.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Lead Profile */}
        <div className="space-y-2">
          <label className="text-slate-300 font-medium">4. Profile Type - What describes you best?</label>
          <select
            value={profile.leadProfile}
            onChange={(e) => setProfile({ ...profile, leadProfile: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 text-slate-100 px-3 py-2 rounded"
          >
            {LEAD_PROFILES.map(profile => (
              <option key={profile} value={profile}>{profile}</option>
            ))}
          </select>
        </div>

        {/* Course Preferences */}
        <div className="space-y-3">
          <label className="text-slate-300 font-medium">5. What matters most to you? (Select all that apply)</label>
          <div className="grid grid-cols-2 gap-2">
            {COURSE_PREFERENCES.map(pref => (
              <button
                key={pref}
                onClick={() => handlePreferenceToggle(pref)}
                className={`text-left px-3 py-2 rounded border transition-colors ${
                  profile.coursePreferences.includes(pref)
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>

        {/* Selected preferences summary */}
        {profile.coursePreferences.length > 0 && (
          <div className="p-3 bg-slate-700 rounded">
            <p className="text-slate-300 text-sm mb-2">Selected interests:</p>
            <div className="flex flex-wrap gap-2">
              {profile.coursePreferences.map(pref => (
                <Badge key={pref} className="bg-blue-600 text-white">
                  {pref}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Profile'
            )}
          </Button>
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileForm;
