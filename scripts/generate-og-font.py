"""Create the build-only OG font from the site's existing Inter subsets."""

from pathlib import Path
from tempfile import TemporaryDirectory

from fontTools.merge import Merger
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

root = Path(__file__).resolve().parent.parent

with TemporaryDirectory(prefix="konrad-og-font-") as temporary:
    paths = []
    for name in ["inter-latin-variable", "inter-polish-variable"]:
        font = TTFont(root / "public" / "fonts" / f"{name}.woff2")
        font = instantiateVariableFont(font, {"wght": 600}, inplace=True)
        font.flavor = None
        path = Path(temporary) / f"{name}.ttf"
        font.save(path)
        paths.append(str(path))

    merged = Merger().merge(paths)
    output = root / "src" / "assets" / "fonts" / "inter-og-semibold.ttf"
    output.parent.mkdir(parents=True, exist_ok=True)
    merged.save(output)
    print(f"Generated {output} ({output.stat().st_size} bytes)")
