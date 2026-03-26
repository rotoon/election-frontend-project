"use client";

import { LeftSidebar } from "@/components/LeftSidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCandidates } from "@/hooks/use-candidates";
import { useElectionResults } from "@/hooks/use-dashboard";
import { usePartyStats } from "@/hooks/use-parties";
import type { Candidate } from "@/types/candidate";
import { Search, User, Users, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

export default function CandidatesListPage() {
  const { data: candidates, isLoading } = useCandidates();
  const { data: parties } = usePartyStats();
  const { data: dashboardData } = useElectionResults();
  const [search, setSearch] = useState("");
  const [selectedPartyId, setSelectedPartyId] = useState<string>("all");
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  const [selectedConstituency, setSelectedConstituency] =
    useState<string>("all");
  const [displayedCount, setDisplayedCount] = useState(12);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );
  const loaderRef = useRef<HTMLDivElement>(null);

  // Extract unique provinces
  const availableProvinces = useMemo(() => {
    if (!candidates) return [];
    const provs = new Map<string, string>();
    candidates.forEach((c) => {
      if (c.constituency) {
        provs.set(c.constituency.province, c.constituency.province);
      }
    });
    return Array.from(provs.values()).sort();
  }, [candidates]);

  // Extract unique constituencies for selected province
  const availableConstituencies = useMemo(() => {
    if (!candidates || selectedProvince === "all") return [];
    const consts = new Set<number>();
    candidates.forEach((c) => {
      if (c.constituency && c.constituency.province === selectedProvince) {
        consts.add(c.constituency.number);
      }
    });
    return Array.from(consts).sort((a, b) => a - b);
  }, [candidates, selectedProvince]);

  const filteredCandidates = useMemo(() => {
    if (!candidates) return [];
    return candidates.filter((c) => {
      const matchesSearch =
        !search ||
        c.full_name.toLowerCase().includes(search.toLowerCase()) ||
        c.candidate_number.toString().includes(search);
      const matchesParty =
        selectedPartyId === "all" || c.party?.id.toString() === selectedPartyId;
      const matchesProvince =
        selectedProvince === "all" ||
        c.constituency?.province === selectedProvince;
      const matchesConstituency =
        selectedConstituency === "all" ||
        c.constituency?.number.toString() === selectedConstituency;

      return (
        matchesSearch && matchesParty && matchesProvince && matchesConstituency
      );
    });
  }, [
    candidates,
    search,
    selectedPartyId,
    selectedProvince,
    selectedConstituency,
  ]);

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedCount(12);
  }, [search, selectedPartyId, selectedProvince, selectedConstituency]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDisplayedCount((prev) => prev + 12);
        }
      },
      { threshold: 0.1 },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [filteredCandidates.length]);

  const currentCandidates = filteredCandidates.slice(0, displayedCount);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen bg-[#121212] text-white font-sans overflow-hidden">
      <LeftSidebar
        countingProgress={dashboardData?.countingProgress}
        updateAt={dashboardData?.updateAt}
      />

      <main className="flex-1 overflow-y-auto bg-[#151515] lg:min-h-0">
        {/* Header */}
        <div className="border-b border-white/5 bg-[#121212]">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-black tracking-tight">ผู้สมัคร</h1>
            <p className="text-white/40 mt-2 text-sm">
              รายชื่อผู้สมัครรับเลือกตั้งทั้งหมด
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="border-b border-white/5 bg-[#121212]/50 sticky top-0 z-20 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row flex-wrap gap-3">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ หรือเบอร์ผู้สมัคร..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#c5a059]/50 focus:ring-1 focus:ring-[#c5a059]/30 transition-colors"
              />
            </div>

            <select
              value={selectedPartyId}
              onChange={(e) => setSelectedPartyId(e.target.value)}
              className="bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c5a059]/50 cursor-pointer w-full md:w-auto min-w-[150px]"
            >
              <option value="all">ทุกพรรค</option>
              {parties?.map((p) => (
                <option key={p.id} value={p.id.toString()}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setSelectedConstituency("all"); // Reset constituency when province changes
              }}
              className="bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c5a059]/50 cursor-pointer w-full md:w-auto min-w-[150px]"
            >
              <option value="all">ทุกจังหวัด</option>
              {availableProvinces.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>

            {selectedProvince !== "all" && (
              <select
                value={selectedConstituency}
                onChange={(e) => setSelectedConstituency(e.target.value)}
                className="bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c5a059]/50 cursor-pointer w-full md:w-auto min-w-[150px]"
              >
                <option value="all">ทุกเขต</option>
                {availableConstituencies.map((cNum) => (
                  <option key={cNum} value={cNum.toString()}>
                    เขตเลือกตั้งที่ {cNum}
                  </option>
                ))}
              </select>
            )}

            {(search ||
              selectedPartyId !== "all" ||
              selectedProvince !== "all" ||
              selectedConstituency !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedPartyId("all");
                  setSelectedProvince("all");
                  setSelectedConstituency("all");
                }}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 hover:text-red-300 transition-colors w-full md:w-auto mt-2 md:mt-0 md:ml-auto"
              >
                <X className="w-4 h-4" />
                <span className="text-sm font-bold">ล้างตัวกรอง</span>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div
                  key={i}
                  className="bg-[#1e1e1e] rounded-2xl border border-white/5 overflow-hidden animate-pulse"
                >
                  <div className="aspect-[4/3] bg-white/5" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 w-3/4 bg-white/10 rounded" />
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-white/5" />
                      <div className="h-4 w-24 bg-white/5 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/40 text-lg">
                {search || selectedPartyId !== "all"
                  ? "ไม่พบผู้สมัครที่ตรงกับเงื่อนไข"
                  : "ไม่พบข้อมูลผู้สมัคร"}
              </p>
            </div>
          ) : (
            <>
              {/* Result count */}
              <div className="text-white/30 text-sm mb-5">
                แสดง {filteredCandidates.length} ผู้สมัคร
                {(search || selectedPartyId !== "all") &&
                  ` (จากทั้งหมด ${candidates?.length || 0})`}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {currentCandidates.map((candidate) => (
                  <CandidateCardDark
                    key={candidate.id}
                    candidate={candidate}
                    onSelect={setSelectedCandidate}
                  />
                ))}
              </div>

              {/* Infinite Scroll Loader */}
              {displayedCount < filteredCandidates.length && (
                <div
                  ref={loaderRef}
                  className="h-24 flex items-center justify-center mt-4 w-full"
                >
                  <div className="w-8 h-8 border-4 border-[#c5a059]/20 border-t-[#c5a059] rounded-full animate-spin" />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Candidate Detail Dialog */}
      <Dialog
        open={!!selectedCandidate}
        onOpenChange={(open) => !open && setSelectedCandidate(null)}
      >
        <DialogContent className="max-w-3xl bg-[#1e1e1e] border-white/10 text-white rounded-2xl">
          <DialogHeader>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-4">
              <div className="w-32 h-44 sm:w-40 sm:h-56 rounded-2xl bg-[#121212] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 relative shadow-2xl">
                {selectedCandidate?.image_url ? (
                  <Image
                    src={selectedCandidate.image_url}
                    alt={selectedCandidate.full_name}
                    fill
                    unoptimized
                    className="object-cover object-top"
                  />
                ) : (
                  <User className="w-10 h-10 text-white/30" />
                )}
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-start">
                  <DialogTitle className="text-3xl font-black text-white leading-tight mb-2">
                    {selectedCandidate?.full_name}
                  </DialogTitle>
                  <div
                    className="px-3 py-1 rounded-lg font-black text-white shadow-md border border-white/10 shrink-0 mr-6"
                    style={{
                      backgroundColor:
                        selectedCandidate?.party?.color || "#c5a059",
                    }}
                  >
                    เบอร์ {selectedCandidate?.candidate_number}
                  </div>
                </div>
                {selectedCandidate?.constituency && (
                  <div className="text-[#c5a059] font-bold text-sm tracking-wide mt-1">
                    📍 เขตเลื่อกตั้งที่ {selectedCandidate.constituency.number}{" "}
                    จังหวัด{selectedCandidate.constituency.province}
                  </div>
                )}

                <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl p-3 mt-4 w-full">
                  <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center overflow-hidden shrink-0">
                    {selectedCandidate?.party?.logo_url ? (
                      <Image
                        src={selectedCandidate.party.logo_url}
                        alt={selectedCandidate.party.name}
                        width={32}
                        height={32}
                        priority
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <p
                      className="text-sm font-bold truncate drop-shadow-sm leading-tight"
                      style={{
                        color: selectedCandidate?.party?.color || "#c5a059",
                      }}
                    >
                      {selectedCandidate?.party?.name || "อิสระ"}
                    </p>
                  </div>
                </div>

                <DialogDescription asChild>
                  <div className="text-white/80 text-sm leading-relaxed whitespace-pre-line mt-4">
                    <div className="bg-white/5 rounded-xl p-5 border border-white/5">
                      {selectedCandidate?.policy || "ไม่มีข้อมูลนโยบาย"}
                    </div>
                  </div>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CandidateCardDark({
  candidate,
  onSelect,
}: {
  candidate: Candidate;
  onSelect: (c: Candidate) => void;
}) {
  const partyColor = candidate.party?.color || "#c5a059";

  return (
    <button
      type="button"
      onClick={() => onSelect(candidate)}
      className="group relative aspect-[3/4] rounded-2xl border border-white/10 overflow-hidden transition-all duration-500 hover:border-[#c5a059]/50 hover:shadow-2xl hover:shadow-[#c5a059]/20 text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a059]/50"
    >
      {/* Full Cover Image */}
      {candidate.image_url ? (
        <Image
          src={candidate.image_url}
          alt={candidate.full_name}
          width={400}
          height={533}
          unoptimized
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-[#1e1e1e] flex items-center justify-center">
          <User className="w-20 h-20 text-white/10" />
        </div>
      )}

      {/* Deep Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Number badge (Top Right) */}
      <div
        className="absolute top-0 right-0 px-4 py-2 rounded-bl-2xl font-black text-white text-xl shadow-lg z-10 backdrop-blur-md"
        style={{ backgroundColor: partyColor }}
      >
        เบอร์ {candidate.candidate_number}
      </div>

      {/* Content overlay (Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end z-10">
        <h3 className="text-white font-black text-2xl leading-tight drop-shadow-md line-clamp-2">
          {candidate.full_name}
        </h3>

        {/* Party info row */}
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-3 mt-4">
          <div className="w-10 h-10 rounded-lg bg-white shadow-inner flex items-center justify-center overflow-hidden shrink-0">
            {candidate.party?.logo_url ? (
              <Image
                src={candidate.party.logo_url}
                alt={candidate.party.name}
                width={40}
                height={40}
                unoptimized
                className="w-full h-full object-cover"
              />
            ) : (
              <Users className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <p
              className="text-sm font-bold truncate drop-shadow-sm leading-tight"
              style={{ color: partyColor }}
            >
              {candidate.party?.name || "อิสระ"}
            </p>
            {candidate.constituency && (
              <p className="text-[11px] text-white/70 mt-1 truncate">
                📍 เขต {candidate.constituency.number} จ.
                {candidate.constituency.province}
              </p>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
