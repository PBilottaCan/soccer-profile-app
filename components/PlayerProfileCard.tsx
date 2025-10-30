import { Player, getPlayerTotals } from "@/data/players";
import { getLevelForPoints } from "@/data/levels";
import type { PersistedTotals } from "@/lib/playerTotals";
import PhotoUploader from "./PhotoUploader";
import { useRef, useState } from "react";
import { levels } from "@/data/levels";

type Props = {
  player: Player;
  totalsOverride?: PersistedTotals;
  onPhotoChange?: (newUrl: string) => void;
};

export default function PlayerProfileCard({ player, totalsOverride, onPhotoChange }: Props) {
  const totals = getPlayerTotals(player);
  const levelInfo = getLevelForPoints(player.points);
  const goals = totalsOverride?.goals ?? totals.goals;
  const assists = totalsOverride?.assists ?? totals.assists;
  const gamesPlayed = totals.gamesPlayed;
  const [editingBio, setEditingBio] = useState(false);
  const [editingLikes, setEditingLikes] = useState(false);
  const [bio, setBio] = useState(player.bio);
  const [likes, setLikes] = useState(player.likes.join(", "));
  const [savingBio, setSavingBio] = useState(false);
  const [savingLikes, setSavingLikes] = useState(false);
  const [bioOrig] = useState(player.bio);
  const [likesOrig] = useState(player.likes.join(", "));
  const [playerOfGame, setPlayerOfGame] = useState(player.playerOfGame ?? 0);

  const isBlob = player.photoUrl.startsWith("blob:");

  async function persistBio(newBio: string) {
    setSavingBio(true);
    await fetch("/api/player/bio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId: player.id, bio: newBio }),
    });
    setSavingBio(false);
  }
  async function persistLikes(newLikes: string[]) {
    setSavingLikes(true);
    await fetch("/api/player/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId: player.id, likes: newLikes }),
    });
    setSavingLikes(false);
  }

  const activeLevel = getLevelForPoints(player.points);
  const milestones = levels;
  const current = getLevelForPoints(player.points);
  const currIdx = milestones.findIndex(lvl => lvl.level === current.level);
  const nextLevel = milestones[currIdx+1];
  const pointsToNext = nextLevel ? Math.max(0, nextLevel.points - player.points) : 0;

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-6 md:flex-row">
      {/* Left column: photo + core badge */}
      <div className="flex flex-col items-center text-center md:w-1/3">
        <div className="relative w-42 h-42 rounded-full overflow-hidden border-2 border-red-600 bg-white shadow flex items-center justify-center mx-auto mt-2 mb-3">
          <img
            src={player.photoUrl}
            alt={player.name}
            className="object-contain w-full h-full"
          />
          {onPhotoChange && (
            <PhotoUploadTextButton
              initialPhotoUrl={player.photoUrl}
              onChange={onPhotoChange}
            />
          )}
        </div>

        <div className="mt-4">
          <div className="text-xl font-bold text-gray-900">
            #{player.number} {player.name}
          </div>

          <div className="text-xs inline-block bg-red-600 text-white rounded-full px-2 py-1 font-semibold uppercase tracking-wide mt-2">
            {player.position}
          </div>

          {/* Level and points */}
          <div className="mt-3 flex flex-col items-center gap-1">
            <div className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-full px-2 py-1 text-center leading-snug">
              {levelInfo.name}
            </div>
            <div className="text-[11px] text-gray-600 font-medium leading-tight text-center">
              {player.points} pts • {levelInfo.tagline}
            </div>
          </div>
        </div>
      </div>

      {/* Right column: bio, likes, totals */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Bio */}
        <div>
          <div className="text-sm text-gray-500 font-semibold font-bold uppercase tracking-wide">
            Player Profile
          </div>
          {editingBio ? (
            <>
              <textarea
                value={bio}
                className="text-base text-gray-800 w-full rounded border p-1 mt-1"
                rows={3}
                autoFocus
                onChange={e => setBio(e.target.value)}
                onKeyDown={async e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (bio !== bioOrig) {
                      await persistBio(bio);
                    }
                    setEditingBio(false);
                  }
                }}
                onBlur={async () => {
                  if (bio !== bioOrig) {
                    await persistBio(bio);
                  }
                  setEditingBio(false);
                }}
              />
              {savingBio && <span className="text-xs text-gray-400 ml-2">Saving…</span>}
            </>
          ) : (
            <div className="text-base text-gray-800 cursor-pointer" onClick={()=>setEditingBio(true)}>{bio}</div>
          )}
        </div>

        {/* Likes / personality */}
        <div>
          <div className="text-sm text-gray-500 font-semibold font-bold uppercase tracking-wide">
            Off the Field
          </div>
          {editingLikes ? (
            <>
              <textarea
                value={likes}
                className="text-base text-gray-800 w-full rounded border p-1 mt-1"
                rows={2}
                autoFocus
                onChange={e => setLikes(e.target.value)}
                onKeyDown={async e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (likes !== likesOrig) {
                      await persistLikes(likes.split(',').map(x=>x.trim()));
                    }
                    setEditingLikes(false);
                  }
                }}
                onBlur={async () => {
                  if (likes !== likesOrig) {
                    await persistLikes(likes.split(',').map(x=>x.trim()));
                  }
                  setEditingLikes(false);
                }}
              />
              {savingLikes && <span className="text-xs text-gray-400 ml-2">Saving…</span>}
            </>
          ) : (
            <ul className="text-base text-gray-800 list-disc list-inside cursor-pointer" onClick={()=>setEditingLikes(true)}>
              {likes.split(",").map((like,i) => <li key={i}>{like.trim()}</li>)}
            </ul>
          )}
        </div>

        {/* Start milestone+summary row as flex */}
        <div className="flex items-center gap-6 mt-6">
          {/* Milestone circle on the left */}
          <div className="border border-gray-900 rounded-full bg-gray-50 w-28 aspect-square flex flex-col items-center justify-center text-center flex-shrink-0">
            <div className="font-bold text-[11px] mb-1 text-black">{current.name}</div>
            <div className="text-[9px] text-gray-800 leading-tight mb-1">{current.tagline}</div>
            {nextLevel ? (
              <div className="text-[9px] text-gray-600">{pointsToNext} pts to next</div>
            ) : (
              <div className="text-[9px] text-gray-600">Max Level</div>
            )}
          </div>
          {/* Stat circles on right */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-stretch">
            {/* Goals */}
            <div className="bg-gray-50 border border-gray-900 rounded-full w-24 aspect-square flex flex-col items-center justify-center text-center mx-auto">
              <div className="text-[9px] text-gray-500 font-medium uppercase tracking-wide mb-1">GOALS</div>
              <div className="text-lg font-bold text-gray-900">{goals}</div>
            </div>
            {/* Assists */}
            <div className="bg-gray-50 border border-gray-900 rounded-full w-24 aspect-square flex flex-col items-center justify-center text-center mx-auto">
              <div className="text-[9px] text-gray-500 font-medium uppercase tracking-wide mb-1">ASSISTS</div>
              <div className="text-lg font-bold text-gray-900">{assists}</div>
            </div>
            {/* Games */}
            <div className="bg-gray-50 border border-gray-900 rounded-full w-24 aspect-square flex flex-col items-center justify-center text-center mx-auto">
              <div className="text-[9px] text-gray-500 font-medium uppercase tracking-wide mb-1">GAMES</div>
              <div className="text-lg font-bold text-gray-900">{gamesPlayed}</div>
            </div>
            {/* Player of the Game */}
            <div className="bg-gray-50 border border-gray-900 rounded-full w-24 aspect-square flex flex-col items-center justify-center text-center mx-auto">
              <div className="text-[8px] text-gray-500 font-medium uppercase tracking-wide mb-0.5 break-words whitespace-normal text-center">
                PLAYER<br />OF THE GAME
              </div>
              <div className="text-lg font-bold text-gray-900">{player.playerOfGame ?? 0}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PhotoUploadTextButton({ initialPhotoUrl, onChange }: { initialPhotoUrl: string; onChange: (s: string) => void }) {
  const fileInput = useRef<HTMLInputElement | null>(null);
  return (
    <>
      <button
        type="button"
        className="absolute inset-0 m-auto w-max h-max text-[10px] text-white text-center font-bold px-2 py-1 bg-black/30 rounded opacity-90 hover:opacity-100 whitespace-normal leading-tight pointer-events-auto z-10"
        style={{ wordBreak: "break-word" }}
        onClick={() => fileInput.current?.click()}
      >
        Upload/Change Photo
      </button>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async e => {
          const file = e.target.files?.[0];
          if (!file) return;
          const body = new FormData();
          body.append("file", file);
          const res = await fetch("/api/upload", { method: "POST", body });
          if (res.ok) {
            const data = await res.json();
            onChange(data.url as string);
          } else {
            alert("Upload failed");
          }
        }}
      />
    </>
  );
}
