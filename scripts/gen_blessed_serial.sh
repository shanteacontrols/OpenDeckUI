#!/usr/bin/env bash

# Generates a signed "blessed serial" entry for OpenDeck UI.
#
# The private key is used only by this script. The UI should embed the matching
# public key and verify the signature over the same payload format.
#
# Key setup:
#   openssl genpkey -algorithm Ed25519 -out opendeck-blessing-private.pem
#   openssl pkey -in opendeck-blessing-private.pem -pubout -out opendeck-blessing-public.pem
#
# Usage:
#   gen_blessed_serial.sh --key=opendeck-blessing-private.pem <serial-hex>
#   gen_blessed_serial.sh --key-stdin <serial-hex> < opendeck-blessing-private.pem

set -euo pipefail

readonly payload_version=1
readonly payload_prefix="opendeck-blessing-v1"
readonly default_features="config"

script_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
blessed_serials_file="${script_dir}/../src/definitions/blessing/blessed-serials.ts"

key_file=
key_stdin=0
serial=
features=$default_features

function usage
{
    printf 'usage: %s [--key=<private.pem>|--key-stdin] [--features=config] [--file=<blessed-serials.ts>] <serial-hex>\n' "${0##*/}" >&2
}

function cleanup
{
    rm -f "$serial_file" "$payload_file" "$signature_file" "$stdin_key_file"
}

function json_escape
{
    local value=$1

    value=${value//\\/\\\\}
    value=${value//\"/\\\"}
    printf '%s' "$value"
}

function ensure_blessed_serials_file
{
    local file=$1

    mkdir -p "$(dirname "$file")"

    if [[ -e $file ]]
    then
        return
    fi

    {
        printf 'export interface IBlessedSerialEntry {\n'
        printf '  version: number;\n'
        printf '  serialHash: string;\n'
        printf '  features: string;\n'
        printf '  signature: string;\n'
        printf '}\n\n'
        printf 'export const blessedSerials: IBlessedSerialEntry[] = [\n'
        printf '];\n'
    } > "$file"
}

function append_blessed_entry
{
    local file=$1
    local version=$2
    local hash=$3
    local entry_features=$4
    local entry_signature=$5
    local temp_file

    ensure_blessed_serials_file "$file"

    if grep -q "\"${hash}\"" "$file"
    then
        printf 'Blessed entry already exists for serial hash: %s\n' "$hash" >&2
        exit 0
    fi

    temp_file=$(mktemp)

    awk \
        -v version="$version" \
        -v hash="$hash" \
        -v entry_features="$(json_escape "$entry_features")" \
        -v entry_signature="$entry_signature" '
        /^];$/ && !inserted {
            print "  {";
            print "    version: " version ",";
            print "    serialHash:";
            print "      \"" hash "\",";
            print "    features: \"" entry_features "\",";
            print "    signature:";
            print "      \"" entry_signature "\",";
            print "  },";
            inserted = 1;
        }
        { print }
        END {
            if (!inserted) {
                exit 1;
            }
        }
    ' "$file" > "$temp_file"

    mv "$temp_file" "$file"
}

function normalize_serial
{
    local value=$1

    value=${value//:/}
    value=${value//-/}
    value=${value// /}
    value=${value#0x}
    value=${value#0X}
    value=${value^^}

    if [[ ! $value =~ ^[0-9A-F]+$ || $(( ${#value} % 2 )) -ne 0 ]]
    then
        printf 'Serial must be an even-length hex string\n' >&2
        exit 2
    fi

    printf '%s' "$value"
}

for arg in "$@"
do
    case "$arg" in
        --key=*)
            key_file=${arg#--key=}
            ;;

        --key-stdin)
            key_stdin=1
            ;;

        --features=*)
            features=${arg#--features=}
            ;;

        --file=*)
            blessed_serials_file=${arg#--file=}
            ;;

        --help|-h)
            usage
            exit 0
            ;;

        --*)
            printf 'Unknown argument: %s\n' "$arg" >&2
            usage
            exit 2
            ;;

        *)
            if [[ -n $serial ]]
            then
                printf 'Unexpected extra argument: %s\n' "$arg" >&2
                usage
                exit 2
            fi

            serial=$arg
            ;;
    esac
done

if [[ -z $serial ]]
then
    usage
    exit 2
fi

if [[ -n $key_file && $key_stdin -eq 1 ]]
then
    printf 'Use either --key or --key-stdin, not both\n' >&2
    exit 2
fi

if [[ -z $key_file && $key_stdin -eq 0 ]]
then
    read -r -p 'Private key PEM path: ' key_file
fi

if [[ -z $features ]]
then
    printf 'Features must not be empty\n' >&2
    exit 2
fi

serial_file=$(mktemp)
payload_file=$(mktemp)
signature_file=$(mktemp)
stdin_key_file=
trap cleanup EXIT

if [[ $key_stdin -eq 1 ]]
then
    stdin_key_file=$(mktemp)
    cat > "$stdin_key_file"
    key_file=$stdin_key_file
fi

if [[ ! -r $key_file ]]
then
    printf 'Private key is not readable: %s\n' "$key_file" >&2
    exit 2
fi

serial_hex=$(normalize_serial "$serial")
printf '%s' "$serial_hex" | xxd -r -p > "$serial_file"

serial_hash=$(openssl dgst -sha256 -binary "$serial_file" | xxd -p -c 256 | tr '[:lower:]' '[:upper:]')
payload="${payload_prefix}|version=${payload_version}|serialHash=${serial_hash}|features=${features}"
printf '%s' "$payload" > "$payload_file"

openssl pkeyutl -sign -rawin -inkey "$key_file" -in "$payload_file" -out "$signature_file"
signature=$(openssl base64 -A -in "$signature_file")

append_blessed_entry "$blessed_serials_file" "$payload_version" "$serial_hash" "$features" "$signature"

printf 'Added blessed serial entry:\n'
printf '  file: %s\n' "$blessed_serials_file"
printf '  serialHash: %s\n' "$serial_hash"
printf '  features: %s\n' "$features"
