import * as fs from 'node:fs';
import * as path from 'node:path';
import * as semver from 'semver';

interface PackageJson {
  engines?: {
    node?: string;
  };
}

export function checkNodeVersion(): void {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, 'utf8'),
  ) as PackageJson;
  const requiredVersion = packageJson.engines?.node;
  const currentVersion = process.version;

  if (!requiredVersion) {
    return;
  }

  const versionMatches = isVersionSatisfied(currentVersion, requiredVersion);

  if (!versionMatches) {
    console.error(
      `\n❌ Node.js version mismatch!\n` +
        `   Required: ${requiredVersion}\n` +
        `   Current:  ${currentVersion}\n` +
        `\nPlease install the correct Node.js version.\n`,
    );
    process.exit(1);
  }
}

function isVersionSatisfied(
  currentVersion: string,
  requiredVersion: string,
): boolean {
  try {
    return semver.satisfies(currentVersion, requiredVersion);
  } catch {
    return compareExactVersion(currentVersion, requiredVersion);
  }
}

function compareExactVersion(
  currentVersion: string,
  requiredVersion: string,
): boolean {
  const current = currentVersion.replace(/^v/, '');
  const required = requiredVersion.replace(/^[^\d]+/, '');
  return current === required;
}
