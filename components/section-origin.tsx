import StorySection from "./story-section";

export default function SectionOrigin() {
  return (
    <StorySection
      index="01"
      coordinate="DEPTH 340M"
      eyebrow="Origin"
      title={<>From the earth</>}
      tone="dark"
      media={
        <video
          className="w-full h-full object-cover opacity-70"
          src="/media/quarry-loop.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      }
    >
      <p className="max-w-md font-body text-quartz/80 leading-relaxed">
        Every slab begins as bedrock, formed over millions of years and cut
        from the quarry face in blocks weighing several tonnes. Nothing about
        it is manufactured — only revealed.
      </p>
    </StorySection>
  );
}
